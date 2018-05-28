import { service } from 'src/plugins/axios'

export function getOrgList() {
    return service({
        url: '/orgs',
        method: 'get'
    })
}