# frozen_string_literal: true

class UserTokensController < ApplicationController
  before_action :require_user
  before_action :get_user_param

  def get_user_param
    @user = api_find(User, params[:user_id])
  end

  def create
    share_student_params = params.permit(:content_type, :content_id)
    allowed_types = ['course', 'quiz', 'module']
    unless share_student_params[:content_type] && share_student_params[:content_id]
      return render(json: { message: 'Content type and id required'}, status: :bad_request)
    end
    unless allowed_types.include?(share_student_params[:content_type])
      return render(json: { message: "Content type not allowed. Allowed types: #{allowed_types.join(',')}" }, status: :bad_request)
    end

    content_type = UserToken::TYPE_TO_CLASS[share_student_params[:content_type]]
    content = content_type&.where(id: share_student_params[:content_id])&.first
    return render(json: { message: 'Requested share content not found'}, status: :bad_request) unless content

    user_token = UserToken.find_or_create_by(user: @user)

    case share_student_params[:content_type]
    when 'quiz'
      render(json: {url: course_quiz_url(content.context, content, token: user_token.token)}) if authorized_action(content.context, @current_user, :manage)
    when 'course'
      render(json: {url: course_url(content, token: user_token.token)}) if authorized_action(content, @current_user, :manage)
    when 'module'
      render(json: {url: course_context_module_url(content.context, content, token: user_token.token)}) if authorized_action(content.context, @current_user, :manage)
    end
  end
end
