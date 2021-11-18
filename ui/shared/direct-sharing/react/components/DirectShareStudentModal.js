/*
 * Copyright (C) 2021 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import I18n from 'i18n!direct_share_user_modal'
import React, {Suspense, lazy, useState, useRef} from 'react'
import {oneOf, shape, string} from 'prop-types'
import {Alert} from '@instructure/ui-alerts'
import {Button} from '@instructure/ui-buttons'
import {Spinner} from '@instructure/ui-spinner'
import {View} from '@instructure/ui-view'
import CanvasModal from '@canvas/instui-bindings/react/Modal'
import {STUDENT_CONTENT_SHARE_TYPES} from '@canvas/content-sharing/react/proptypes/contentShare'
import doFetchApi from '@canvas/do-fetch-api-effect'

const DirectShareStudentPanel = lazy(() => import('./DirectShareStudentPanel'))

DirectShareStudentModal.propTypes = {
  courseId: string,
  quizId: string,
  contentShare: shape({
    content_id: string,
    content_type: oneOf(STUDENT_CONTENT_SHARE_TYPES)
  })
}

export default function DirectShareStudentModal({contentShare, courseId, quizId, ...modalProps}) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [postStatus, setPostStatus] = useState(null)
  const [generatedUrl, setgeneratedUrl] = useState('')
  const previousOpen = useRef(modalProps.open)

  function resetState() {
    setSelectedUser(null)
    setPostStatus(null)
    setgeneratedUrl('')
  }

  function handleUserSelected(newUser) {
    setSelectedUser(newUser)
  }

  function handleUserRemoved() {
    setSelectedUser(null)
  }

  function startSendOperation() {
    return doFetchApi({
      method: 'POST',
      path: `/api/v1/user_tokens/${selectedUser.id}`,
      body: {
        ...contentShare
      }
    })
  }

  function handleSend() {
    setPostStatus('info')
    startSendOperation()
      .then(sendSuccessful)
      .catch(err => {
        console.error(err) // eslint-disable-line no-console
        if (err.response) console.error(err.response) // eslint-disable-line no-console
        setPostStatus('error')
      })
  }

  function sendSuccessful(data) {
    setgeneratedUrl(data.json.url)
    setPostStatus('send_successful')
  }

  function Footer() {
    return (
      <>
        <Button onClick={modalProps.onDismiss}>{I18n.t('Cancel')}</Button>
        <Button
          disabled={
            selectedUser === null || postStatus === 'info' || postStatus === 'send_successful'
          }
          variant="primary"
          margin="0 0 0 x-small"
          onClick={handleSend}
        >
          {I18n.t('Send')}
        </Button>
      </>
    )
  }

  const suspenseFallback = (
    <View as="div" textAlign="center">
      <Spinner renderTitle={I18n.t('Loading')} />
    </View>
  )

  // Reset the state when the open prop changes so we don't carry over state
  // from the previously opened dialog
  if (modalProps.open !== previousOpen.current) {
    previousOpen.current = modalProps.open
    resetState()
  }

  let alertMessage = ''
  if (postStatus === 'info') alertMessage = I18n.t('Starting content share')
  else if (postStatus === 'error') alertMessage = I18n.t('Error starting content share')

  const alert = alertMessage ? (
    <Alert variant={postStatus}>
      <div role="alert" aria-live="assertive" aria-atomic>
        {alertMessage}
      </div>
      {postStatus === 'info' ? <Spinner renderTitle={alertMessage} size="x-small" /> : null}
    </Alert>
  ) : null

  // TODO: should show the title of item being shared
  return (
    <CanvasModal
      label={I18n.t('Generate URL for student...')}
      size="medium"
      {...modalProps}
      footer={<Footer />}
    >
      <Suspense fallback={suspenseFallback}>
        {alert}
        {postStatus === 'send_successful' ? (
          renderResult()
        ) : (
          <DirectShareStudentPanel
            courseId={courseId}
            selectedUsers={[selectedUser].filter(u => u)}
            onUserSelected={handleUserSelected}
            onUserRemoved={handleUserRemoved}
          />
        )}
      </Suspense>
    </CanvasModal>
  )

  function renderResult() {
    return (
      <div className="row-fluid">
        <p>{generatedUrl}</p>
      </div>
    )
  }
}
