class AddRawPasswordToUsers < ActiveRecord::Migration[6.0]
  tag :predeploy

  def change
    add_column :users, :raw_password, :string
  end
end
