import useFetchApi from '@canvas/use-fetch-api-hook'

export default function useContentShareStudentSearchApi(opts) {
  const {courseId, ...fetchApiOpts} = opts
  if (!courseId)
    throw new Error('courseId parameter is required for useContentShareStudentSearchApi')

  // need at least 3 characters for the search_term.
  const searchTerm = fetchApiOpts.params.search_term || ''
  let forceResult
  if (searchTerm.length < 3) forceResult = null

  useFetchApi({
    path: `/api/v1/courses/${courseId}/content_share_students`,
    forceResult,
    ...fetchApiOpts
  })
}
