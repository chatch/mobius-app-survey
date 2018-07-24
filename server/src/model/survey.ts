import {
  attribute,
  autoGeneratedHashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations'

@table('surveys')
class Survey {
  @autoGeneratedHashKey() id: string
  @attribute() name: string
  @attribute() userId: string
  @attribute() completions: number
  @attribute() completionsDone: number
  @attribute() json: string
}

export default Survey
