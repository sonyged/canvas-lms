# frozen_string_literal: true

class UserToken < ApplicationRecord
  TYPE_TO_CLASS = {
    'course' => Course,
    'quiz' => Quizzes::Quiz,
    'module' => ContextModule
  }.freeze

  belongs_to :user

  before_validation :generate_token

  validates :token, format: {with: /[0-9a-f]{32}/}
  validates :token, uniqueness: true

  private

  def generate_token
    self.token = SecureRandom.hex if self.token.blank?
  end
end
