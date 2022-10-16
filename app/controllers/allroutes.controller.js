const post = require('./post.controller');
const report = require('./report.controller');
const user = require('./user.controller');
const things = require('./things.controller');
const foodcategory = require('./foodcategory.controller');
const admin = require('./admin.controller');
const email = require('./email.controller');
const summary = require('./summary.controller');
const role = require('./role.controller');
const permissions = require('./permissions.controller');
const deliverytime = require('./deliverytime.controller');
const responsetime = require('./responsetime.controller');
const question = require('./questions.controller');
const currency = require('./currency.controller');
const verification = require('./verification.controller');

exports.api = (req, res) => {
  if(!req.body.service) {
    res.status(400).json({ success: 0, message: "Service not found" });
    return;
  }
  if(!req.body.request.data || Object.keys(req.body.request.data).length === 0) {
    res.status(400).json({ success: 0, message: "Data not found" });
    return;
  }
  const request = req;
  var data = { req: req.body.request.data, res: res ,callback: respData };
    services(data, request);
};

const services = (data, request) => {
  switch (request.body.service) {    
    case "posts":
      post.create(data);
      break;

    case "reports":
      report.create(data);
      break;

    case "get-reports":
      report.findAll(data);
      break;

    case "owner-hide":
      post.update(data);
      break;

    case "ordinary-hide":
      hide.create(data);
      break;
    
    
    case "search-posts":
      post.searchPosts(data);
      break;

    case "search-recipes":
      post.searchRecipes(data);
      break;

    case "trending-hashtags":
      post.trendingHashtags(data);
      break;

    case "get-hidden-posts":
      hide.hiddenByUser(data);
      break;

    case "delete-post":
      post.delete(data);
      break;

    case "delete-comment":
      comments.delete(data);
      break;

    case "update-things":
      user.updateThings(data);
      break;

    case "update-privacy":
      user.updatePrivacy(data);
      break;

    case "update-password":
      user.updatePassword(data);
      break;
    
    case "get-blocked-users":
      user.blockedUsers(data);
      break;

    case "users-by-contact":
      user.usersByContact(data);
      break;

    case "get-all-users":
      user.getAllUsers(data);
      break;

    case "add-interests":
      things.create(data);
      break;

    case "get-all-interests":
      things.getAll(data);
      break;

    case "get-single-interest":
      things.getOne(data);
      break;

    case "update-interests":
      things.update(data);
      break;
    
    case "delete-interests":
      things.delete(data);
      break;

    case "add-foodcategory":
      foodcategory.create(data);
      break;

    case "get-all-foodcategory":
      foodcategory.getAll(data);
      break;

    case "get-single-foodcategory":
      foodcategory.getOne(data);
      break;

    case "update-foodcategory":
      foodcategory.update(data);
      break;
    
    case "delete-foodcategory":
      foodcategory.delete(data);
      break;

    case "hide-foodcategory":
      foodcategory.hide(data);
      break;

    case "get-reported-posts":
      post.getReportedPosts(data);
      break;

    case "add-admins":
      admin.create(data);
      break;

    case "get-all-admins":
      admin.getAll(data);
      break;

    case "get-single-admin":
      admin.getOne(data);
      break;

    case "update-admins":
      admin.update(data);
      break;
    
    case "delete-admins":
      admin.delete(data);
      break;

    case "email-users":
      email.emailUsers(data);
      break;

    case "summary-report":
      summary.getSummary(data);
      break;

    case "add-roles":
      role.create(data);
      break;

    case "get-all-roles":
      role.getAll(data);
      break;

    case "get-single-role":
      role.getOne(data);
      break;

    case "update-roles":
      role.update(data);
      break;
    
    case "delete-roles":
      role.delete(data);
      break;

    case "add-permissions":
      permissions.create(data);
      break;

    case "add-deliverytimes":
      deliverytime.create(data);
      break;

    case "get-all-deliverytimes":
      deliverytime.getAll(data);
      break;

    case "get-single-deliverytime":
      deliverytime.getOne(data);
      break;

    case "update-deliverytimes":
      deliverytime.update(data);
      break;
    
    case "delete-deliverytimes":
      deliverytime.delete(data);
      break;

    case "add-responsetimes":
      responsetime.create(data);
      break;

    case "get-all-responsetimes":
      responsetime.getAll(data);
      break;

    case "get-single-responsetime":
      responsetime.getOne(data);
      break;

    case "update-responsetimes":
      responsetime.update(data);
      break;
    
    case "delete-responsetimes":
      responsetime.delete(data);
      break;

    case "add-questions":
      question.create(data);
      break;

    case "get-all-questions":
      question.getAll(data);
      break;

    case "get-single-question":
      question.getOne(data);
      break;

    case "update-questions":
      question.update(data);
      break;
    
    case "delete-questions":
      question.delete(data);
      break;

    case "add-currencies":
      currency.create(data);
      break;

    case "get-all-currencies":
      currency.getAll(data);
      break;

    case "get-single-currency":
      currency.getOne(data);
      break;

    case "update-currencies":
      currency.update(data);
      break;
    
    case "delete-currencies":
      currency.delete(data);
      break;
    
    case "toogle-currency-status":
      currency.toogleStatus(data);
      break;

    case "activate-all-currencies":
      currency.activate(data);
      break;
    
    case "deactivate-all-currencies":
      currency.deactivate(data);
      break;

    case "approve-verification":
      verification.approve(data);
      break;

    case "decline-verification":
      verification.decline(data);
      break;

    default:
      data.res.status(404).json({ success: 0, message: "Service not found" });
      break;
  }
};

function respData(resp, err) {
  if (err) {
    resp.res.status(400).json({
      success: 0,
      message: err.details[0].message.replace(/"/g, "").split(": /^(?=")[0],
    });
    return;
  }
}