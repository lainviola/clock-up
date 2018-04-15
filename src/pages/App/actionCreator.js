import { parseTime } from '../../util'
import type { CurrentTime } from '../types/CurrentTime'
import { type } from '../../types/ReduxAction'
import type { SyncDateAction } from '../types/ReduxAction'

export const syncDate = (): SyncDateAction => {
  const time: CurrentTime = parseTime(new Date())
  return {
    type: type.SYNC_DATE,
    currentTime: time
  }
}
