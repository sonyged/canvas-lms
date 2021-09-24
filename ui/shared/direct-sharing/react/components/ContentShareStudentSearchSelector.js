import I18n from 'i18n!user_search_selector'
import React, {useState} from 'react'
import {arrayOf, func, string} from 'prop-types'

import CanvasAsyncSelect from '@canvas/instui-bindings/react/AsyncSelect'
import useDebouncedSearchTerm from '../hooks/useDebouncedSearchTerm'
import useContentShareStudentSearchApi from '../effects/useContentShareStudentSearchApi'
import UserSearchSelectorItem from './UserSearchSelectorItem'
import {basicUser} from '@canvas/users/react/proptypes/user'

ContentShareStudentSearchSelector.propTypes = {
  courseId: string.isRequired,
  onUserSelected: func.isRequired,
  selectedUsers: arrayOf(basicUser),
  ...(() => {
    const {renderLabel, ...restOfSelectPropTypes} = CanvasAsyncSelect.propTypes
    return restOfSelectPropTypes
  })()
}

ContentShareStudentSearchSelector.defaultProps = {
  selectedUsers: []
}

const MINIMUM_SEARCH_LENGTH = 3

const isSearchableTerm = term => term.length >= MINIMUM_SEARCH_LENGTH

export default function ContentShareStudentSearchSelector({
  courseId,
  onUserSelected,
  selectedUsers,
  ...restOfSelectProps
}) {
  const [searchedUsers, setSearchedUsers] = useState(null)
  const [error, setError] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const {searchTerm, setSearchTerm, searchTermIsPending} = useDebouncedSearchTerm('', {
    isSearchableTerm
  })

  const userSearchParams = {}
  if (searchTerm.length >= 3) userSearchParams.search_term = searchTerm
  useContentShareStudentSearchApi({
    courseId,
    success: setSearchedUsers,
    error: setError,
    loading: setIsLoading,
    params: userSearchParams
  })

  function handleUserSelected(_ev, id) {
    if (searchedUsers === null) return
    const user = searchedUsers.find(u => u.id === id)
    onUserSelected(user)
    setInputValue('')
  }

  function handleInputChanged(ev) {
    setInputValue(ev.target.value)
    setSearchTerm(ev.target.value)
  }

  if (error !== null) throw error

  const noOptionsLabel = isSearchableTerm(inputValue)
    ? I18n.t('No Results')
    : I18n.t('Enter at least %{count} characters', {count: MINIMUM_SEARCH_LENGTH})

  const selectProps = {
    inputValue,
    isLoading: isLoading || searchTermIsPending,
    renderLabel: I18n.t('Send to:'),
    assistiveText: I18n.t('Enter at least %{count} characters', {count: MINIMUM_SEARCH_LENGTH}),
    placeholder: I18n.t('Begin typing to search'),
    noOptionsLabel,
    onInputChange: handleInputChanged,
    onOptionSelected: handleUserSelected
  }

  let userOptions = []
  if (searchedUsers !== null && isSearchableTerm(inputValue)) {
    const selectedUsersIds = selectedUsers.map(user => user.id)
    userOptions = searchedUsers
      .filter(user => !selectedUsersIds.includes(user.id))
      .map(user => (
        <CanvasAsyncSelect.Option key={user.id} id={user.id} value={user.id}>
          <UserSearchSelectorItem user={user} />
        </CanvasAsyncSelect.Option>
      ))
  }

  return (
    <CanvasAsyncSelect {...restOfSelectProps} {...selectProps}>
      {userOptions}
    </CanvasAsyncSelect>
  )
}
