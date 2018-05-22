import { getStorageToken } from 'src/utils/auth'
export default {
  token: getStorageToken(),
  name: '',
  avatar: '',
  roles: [],
  permissions: []
}
