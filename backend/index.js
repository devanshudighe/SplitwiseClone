

const app = require('./app');
var login = require('./routes/login');
var signup = require('./routes/signup');
var profile = require('./routes/profile');
var upload = require('./routes/upload');
var groups = require('./routes/newGroups')
var addMember = require('./routes/addMember')
var myGroups = require('./routes/myGroups')
var addBill = require('./routes/addUserBill')
var dashboard = require('./routes/dashboard')
var recentActivity = require('./routes/recentActivity')
var groupDetails = require('./routes/groupDetails')

app.use('/login',login)
app.use('/signup',signup)
app.use('/profile',profile)
app.use('/upload',upload)
app.use('/groups',groups)
app.use('/member',addMember)
app.use('/myGroups',myGroups)
app.use('/bill',addBill)
app.use('/dashboard',dashboard)
app.use('/recent',recentActivity)
app.use('/groupdetails',groupDetails)


const port = process.env.PORT || 3001;
app.listen(port, ()=> console.log(`Listening on port ${port}`));

// module.exports = app;