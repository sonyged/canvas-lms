class AddSomeColumnToQuiz < ActiveRecord::Migration[6.0]
  tag :predeploy

  def change
    add_column :quizzes, :subject, :integer
    add_column :quizzes, :grade, :integer
    add_column :quizzes, :unit, :integer
    add_column :quizzes, :difficulty, :integer
  end
end
