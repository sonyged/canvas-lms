# frozen_string_literal: true

#
# Copyright (C) 2020 - present Instructure, Inc.
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

class AddUniqueIndexToNotificationEndpoint < ActiveRecord::Migration[5.2]
  tag :postdeploy
  disable_ddl_transaction!

  def up
    DataFixup::DeleteDuplicateRows.run(NotificationEndpoint, :arn, :access_token_id)
    remove_index :notification_endpoints, column: [:access_token_id, :arn], if_exists: true
    add_index :notification_endpoints, [:access_token_id, :arn], algorithm: :concurrently,
              where: "workflow_state='active'", unique: true, if_not_exists: true
  end
  
  def down
    remove_index :notification_endpoints, column: [:access_token_id, :arn], if_exists: true
  end
end
