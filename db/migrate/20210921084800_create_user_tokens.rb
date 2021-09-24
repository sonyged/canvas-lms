# frozen_string_literal: true

class CreateUserTokens < ActiveRecord::Migration[6.0]
  tag :predeploy

  def change
    create_table :user_tokens do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :token, null: false
      t.datetime :expired_at

      t.timestamps
    end
  end
end
