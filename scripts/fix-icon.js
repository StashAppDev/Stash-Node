var rcedit = require("../node_modules/rcedit/lib/rcedit")

rcedit("builds/win/stash.exe", {icon: "resources/icon.png"}, function(err) {
  console.log(`Complete.  Error: ${err.message}`)
})