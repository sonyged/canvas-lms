# frozen_string_literal: true

#
# Copyright (C) 2018 - present Instructure, Inc.
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
#

module Types
  class QuizSubmissionType < ApplicationObjectType
    graphql_name "QuizSubmission"

    implements GraphQL::Types::Relay::Node
    implements Interfaces::TimestampInterface
    implements Interfaces::LegacyIDInterface

    alias quiz_submission object

    global_id_field :id

    field :quiz_id, Integer, "quiz_id", method: :quiz_id, null: true
    field :user_id, Integer, "user_id", method: :user_id, null: true
    field :score, Integer, "score", method: :score, null: true
    field :kept_score, Integer, "kept_score", method: :kept_score, null: true
    field :quiz_points_possible, Integer, "quiz_points_possible", method: :quiz_points_possible, null: true

    field :course_id, String, "course_id", method: :course_id, null: false
    def course_id
      quiz_submission.quiz.context_id
    end

    field :all_correct, Boolean, null: false
    def all_correct
      return false if quiz_submission.kept_score.blank? || quiz_submission.quiz_points_possible.blank?
      quiz_submission.kept_score == quiz_submission.quiz_points_possible
    end

    field :submission_data, String, null: true
    def submission_data
      quiz_submission.submission_data.to_json
    end

    field :quiz_data, String, null: true
    def quiz_data
      quiz_submission.quiz_data.to_json
    end
  end
end
