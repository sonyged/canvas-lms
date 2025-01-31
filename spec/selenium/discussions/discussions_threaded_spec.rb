# frozen_string_literal: true

#
# Copyright (C) 2012 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.

require File.expand_path(File.dirname(__FILE__) + '/../helpers/discussions_common')
require_relative 'pages/discussion_page'

describe "threaded discussions" do
  include_context "in-process server selenium tests"
  include DiscussionsCommon

  before :once do
    Account.default.enable_feature!(:rce_enhancements)
    course_with_teacher(active_course: true, active_all: true, name: 'teacher')
    @topic_title = 'threaded discussion topic'
    @topic = create_discussion(@topic_title, 'threaded')
    @student = student_in_course(course: @course, name: 'student', active_all: true).user
  end

  before(:each) do
    user_session(@teacher)
    stub_rcs_config
  end

  context "when discussions redesign feature flag is OFF" do
    before :once do
      Account.site_admin.disable_feature! :react_discussions_post
    end
  
    it "should reply with iframe element" do
      entry_text = "<iframe src='https://example.com'></iframe>"
      Discussion.visit(@course, @topic)
      f('#discussion_topic').find_element(:css, '.discussion-reply-action').click
      wait_for_ajaximations
      f('[data-btn-id="rce-edit-btn"]').click
      wait_for_ajaximations
      f("textarea[data-rich_text='true']").send_keys entry_text
      fj("button:contains('Post Reply')").click
      wait_for_ajaximations
      expect(get_all_replies.count).to eq 1
      expect(f("iframe[src='https://example.com']")).to be_present
    end
  
    it "should allow edits to entries with replies", priority: "2", test_id: 222520 do
      edit_text = 'edit message'
      entry = @topic.discussion_entries.create!(
        user: @student,
        message: 'new threaded reply from student'
      )
      child_entry = @topic.discussion_entries.create!(
        user: @student,
        message: 'new threaded child reply from student',
        parent_entry: entry
      )
      Discussion.visit(@course, @topic)
      edit_entry(entry, edit_text)
      expect(entry.reload.message).to match(edit_text)
    end
  
    it "should not allow edits for a concluded student", priority: "2", test_id: 222526 do
      student_enrollment = course_with_student(
        :course => @course,
        :user => @student,
        :active_enrollment => true
      )
      entry = @topic.discussion_entries.create!(
        user: @student,
        message: 'new threaded reply from student'
      )
      user_session(@student)
      Discussion.visit(@course, @topic)
      student_enrollment.send("conclude")
      Discussion.visit(@course, @topic)
      wait_for_ajaximations
  
      fj("#entry-#{entry.id} .al-trigger").click
      expect(fj('.al-options:visible').text).to include("Edit (Disabled)")
    end
  
    it "should not allow deletes for a concluded student", priority: "2", test_id: 222526 do
      student_enrollment = course_with_student(
        :course => @course,
        :user => @student,
        :active_enrollment => true
      )
      entry = @topic.discussion_entries.create!(
        user: @student,
        message: 'new threaded reply from student'
      )
      user_session(@student)
      Discussion.visit(@course, @topic)
      student_enrollment.send("conclude")
      Discussion.visit(@course, @topic)
      wait_for_ajaximations
  
      fj("#entry-#{entry.id} .al-trigger").click
      expect(fj('.al-options:visible').text).to include("Delete (Disabled)")
    end
  
    it "should allow edits to discussion with replies", priority: "1", test_id: 150513 do
      reply_depth = 3
      reply_depth.times { |i| @topic.discussion_entries.create!(user: @student,
                                                                message: "new threaded reply #{i} from student",
                                                                parent_entry: DiscussionEntry.last) }
      Discussion.visit(@course, @topic)
      expect_new_page_load{ f('.edit-btn').click }
      edit_topic('edited title', 'edited message')
      expect(get_all_replies.count).to eq 3
    end
  
    it "should edit a reply", priority: "1", test_id: 150514 do
      edit_text = 'edit message'
      entry = @topic.discussion_entries.create!(user: @student, message: "new threaded reply from student")
      Discussion.visit(@course, @topic)
      edit_entry(entry, edit_text)
    end
  
    it "should not allow students to edit replies to a locked topic", priority: "1", test_id: 222521 do
      user_session(@student)
      entry = @topic.discussion_entries.create!(user: @student, message: "new threaded reply from student")
      @topic.lock!
      Discussion.visit(@course, @topic)
      wait_for_ajaximations
  
      fj("#entry-#{entry.id} .al-trigger").click
      wait_for_ajaximations
  
      expect(fj('.al-options:visible').text).to include("Edit (Disabled)")
    end
  
    it "should show a reply time that is different from the creation time", priority: "2", test_id: 113813 do
      @enrollment.workflow_state = 'active'
      @enrollment.save!
  
      # Reset discussion created_at time to two minutes ago
      @topic.update_attribute(:posted_at, Time.zone.now - 2.minute)
  
      # Create reply message and reset created_at to one minute ago
      @topic.reply_from(user: @student, html: "New test reply")
      reply = DiscussionEntry.last
      reply.update_attribute(:created_at, Time.zone.now - 1.minute)
  
      # Navigate to discussion URL
      Discussion.visit(@course, @topic)
  
      replied_at = f('.discussion-pubdate.hide-if-collapsed > time').attribute("data-html-tooltip-title")
  
      edit_entry(reply, "Reply edited")
      reply.reload
      edited_at = format_time_for_view(reply.updated_at)
      displayed_edited_at = f('.discussion-fyi').text
  
      # Verify displayed edit time includes object update time
      expect(displayed_edited_at).to include(edited_at)
  
      # Verify edit time is different than reply time
      expect(replied_at).not_to eql(edited_at)
    end
  
    it "should delete a reply", priority: "1", test_id: 150515 do
      skip_if_safari(:alert)
      entry = @topic.discussion_entries.create!(user: @student, message: "new threaded reply from student")
      Discussion.visit(@course, @topic)
      delete_entry(entry)
    end
  
    it "should display editor name and timestamp after edit", priority: "2", test_id: 222522 do
      skip_if_chrome('needs research: passes locally fails on Jenkins ')
      edit_text = 'edit message'
      entry = @topic.discussion_entries.create!(user: @student, message: "new threaded reply from student")
      Discussion.visit(@course, @topic)
      edit_entry(entry, edit_text)
      wait_for_ajaximations
      expect(f("#entry-#{entry.id} .discussion-fyi").text).to match("Edited by #{@teacher.name} on")
    end
  
    it "should support repeated editing", priority: "2", test_id: 222523 do
      entry = @topic.discussion_entries.create!(user: @student, message: "new threaded reply from student")
      Discussion.visit(@course, @topic)
      edit_entry(entry, 'New text 1')
      expect(f("#entry-#{entry.id} .discussion-fyi").text).to match("Edited by #{@teacher.name} on")
      # second edit
      edit_entry(entry, 'New text 2')
      entry.reload
      expect(entry.message).to match 'New text 2'
    end
  
    it "should re-render replies after editing", priority: "2", test_id: 222524 do
      edit_text = 'edit message'
      entry = @topic.discussion_entries.create!(user: @student, message: "new threaded reply from student")
  
      Discussion.visit(@course, @topic)
      @last_entry = f("#entry-#{entry.id}")
      reply_text = "this is a reply"
      add_reply(reply_text)
      expect { DiscussionEntry.count }.to become(2)
      subentry = DiscussionEntry.last
      refresh_page
  
      expect(f("#entry-#{entry.id} #entry-#{subentry.id}")).to be_truthy, "precondition"
      edit_entry(entry, edit_text)
      expect(f("#entry-#{entry.id} #entry-#{subentry.id}")).to be_truthy
    end
  
    it "should display editor name and timestamp after delete", priority: "2", test_id: 222525  do
      entry_text = 'new entry'
      Discussion.visit(@course, @topic)
  
      fj('label[for="showDeleted"]').click()
      add_reply(entry_text)
      entry = DiscussionEntry.last
      delete_entry(entry)
      expect(f("#entry-#{entry.id} .discussion-title").text).to match("Deleted by #{@teacher.name} on")
    end
  
    context "student tray" do
      before(:each) do
        @account = Account.default
      end
  
      it "discussion page should display student name in tray", priority: "1", test_id: 3022069 do
        topic = @course.discussion_topics.create!(
          user: @teacher,
          title: 'Non threaded discussion',
          message: 'discussion topic message'
        )
        topic.discussion_entries.create!(
          user: @student,
          message: "new threaded reply from student",
          parent_entry: DiscussionEntry.last
        )
        Discussion.visit(@course, topic)
        f("a[data-student_id='#{@student.id}']").click
        expect(f(".StudentContextTray-Header__Name h2 a")).to include_text("student")
      end
    end
  end

  context "when discussions redesign feature flag is ON" do
    before :once do
      Account.site_admin.enable_feature! :react_discussions_post
    end
    
    it "should reply with iframe element" do
      entry_text = "<iframe src='https://example.com'></iframe>"
      get "/courses/#{@course.id}/discussion_topics/#{@topic.id}"
      f("button[data-testid='discussion-topic-reply']").click
      wait_for_ajaximations
      f('[data-btn-id="rce-edit-btn"]').click
      wait_for_ajaximations
      f("textarea[data-rich_text='true']").send_keys entry_text
      fj("button:contains('Reply')").click
      wait_for_ajaximations
      expect(f("iframe[src='https://example.com']")).to be_present
    end
  end
end
