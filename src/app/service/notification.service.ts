/*
Copyright (c) 2017-2018 brewlabs SAS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { Injectable } from "@angular/core"
import { UIStateStore } from "../state/ui.state.store"
import { MsgGroup, Msg } from "../state/ui.models"

/**
 * Created by cmathew on 14/07/16.
 */

@Injectable()
export class NotificationService {
  constructor(private uiStateStore: UIStateStore) {}

  warn(notification: Notification) {
    this.displayNotification(Severity.WARN, [notification])
  }

  displayNotification(severity: string, notifications: Notification[]) {
    const messages: Msg[] = []
    notifications.forEach(n =>
      messages.push({
        severity: severity,
        summary: n.title,
        detail: n.description
      })
    )

    const msgGroup: MsgGroup = {
      messages: messages,
      sticky: false,
      delay: 3000
    }
    this.uiStateStore.setDisplayMessages(msgGroup)
  }
}

export class Notification {
  title: string
  description: string
}

export class Severity {
  static SUCCESS = "success"
  static INFO = "info"
  static WARN = "warn"
  static ERROR = "error"
}
