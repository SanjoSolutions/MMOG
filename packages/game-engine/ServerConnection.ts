import type { Subject } from "rxjs"

export interface ServerConnection {
  inStream: Subject<any>
  outStream: Subject<any>
}
