import {Injectable} from "@angular/core"
import {UIStateStore} from "../ui.state.store"
import {Msg, MsgGroup} from "../ui.models"
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
        let messages: Msg[] = []
        notifications.forEach(n => messages.push({
            severity: severity,
              summary: n.title,
              detail:n.description
        }))

        let msgGroup: MsgGroup = {
            messages: messages,
            sticky: false,
            delay: 3000
        }
        this.uiStateStore
          .setDisplayMessages(msgGroup)
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