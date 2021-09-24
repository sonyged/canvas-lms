import I18n from 'i18n!direct_share_user_panel'
import React from 'react'
import {arrayOf, func, string} from 'prop-types'
import {Tag} from '@instructure/ui-tag'
import ContentShareStudentSearchSelector from './ContentShareStudentSearchSelector'
import {basicUser} from '@canvas/users/react/proptypes/user'

DirectShareStudentPanel.propTypes = {
  courseId: string,
  selectedUsers: arrayOf(basicUser),
  onUserSelected: func, // basicUser => {}
  onUserRemoved: func // basicUser => {}
}

export default function DirectShareStudentPanel({
  selectedUsers,
  onUserSelected,
  onUserRemoved,
  courseId
}) {
  function renderSelectedUserTags() {
    return selectedUsers.map(user => (
      <Tag
        key={user.id}
        dismissible
        title={I18n.t('Remove %{name}', {name: user.name})}
        text={user.name}
        onClick={() => onUserRemoved(user)}
      />
    ))
  }

  return (
    <ContentShareStudentSearchSelector
      courseId={courseId || ENV.COURSE_ID || ENV.COURSE.id}
      onUserSelected={onUserSelected}
      selectedUsers={selectedUsers}
      renderBeforeInput={renderSelectedUserTags}
    />
  )
}
