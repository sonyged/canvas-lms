class AddAnswerTypeToQuizzes < ActiveRecord::Migration[6.0]
  tag :predeploy

  def change
    add_column :quizzes, :answer_type, :integer
  end
end
