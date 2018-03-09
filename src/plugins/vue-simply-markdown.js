import VueSimpleMarkdown from 'vue-simple-markdown'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-simple-markdown/dist/vue-simple-markdown.css'
// leave the export, even if you don't use it
export default ({ Vue }) => {
  // something to do
  Vue.use(VueSimpleMarkdown)
}
