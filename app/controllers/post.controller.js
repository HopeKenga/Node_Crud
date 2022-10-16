const { userHasPermission } = require("../helpers/permissionChecker");
const Post = require("../models/post.model");
// Create and Save a new Post
exports.create = ({req, res}) => {
  //Validate request
    if(!req) {
      res.status(400).send({
          message: "Content can not be empty!"
      });
    }
    //Create a Post
    const post = new Post({
        user_id: req.user_id || 0,
        pie_user_id: req.pie_user_id || 0,
        parent_id: req.parent_id || 0,
        title: req.title || null,
        category: req.category || null,
        meal_event_id: req.meal_event_id || 0,
        pies_text: req.pies_text || "",
        share_text: req.share_text || "",
        pies_media: req.pies_media || "",
        prev_title: req.prev_title || null,
        prev_image: req.prev_image || null,
        prev_url: req.prev_url || null,
        prev_desc: req.prev_desc || null,
        view_count: req.view_count || 0,
        like_count: req.like_count || 0,
        comment_count: req.comment_count || 0,
        pies_type: req.pies_type || "",
        post_type: req.post_type || "",
        dimension: req.dimension || null,
        is_reported: req.is_reported || 0,
        report_by: req.report_by || 0,
        why_reporting: req.why_reporting || 0,
        reporting_text: req.reporting_text || 0,
        recipe: req.recipe,
        is_hide: req.is_hide || 0,
        is_deleted: req.is_deleted || 0,
        creation_datetime: req.creation_datetime || new Date(),
        modification_datetime: req.modification_datetime || new Date(),
        deletion_datetime: req.deletion_datetime || "0000-00-00 00:00:00"
    });
    //Save Comment in the database
    Post.create(post, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Post."
            });
        else res.send(data);
    });
}
// Find a single Post with a id
exports.findOne = ({req, res}) => {
  Post.findById(req.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Post with user_id ${req.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Post with user_id " + req.id
        });
      }
    } 
    
    else {
      res.send(data);
    }
    // else res.send(data);
  });
};
// Hide a post identified by the id in the request
exports.update = ({req, res, params}) => {
  // Validate Request
  if (!req) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  Post.updateById(
    params.id,
    new Post(req),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Post with id ${params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error hiding Post with id " + params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Find pies with search text
exports.searchPosts = ({req, res}) => {
  Post.searchPies(req.search_text, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found pies with text ${req.search_text}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving pies with text " + req.search_text
        });
      }
    } 
    
    else {
      res.send(data);
    }
    // else res.send(data);
  });
};

// Find recipes with search text
exports.searchRecipes = ({req, res}) => {
  Post.searchRecipes(req.search_text, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found recipes with text ${req.search_text}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving recipes with text " + req.search_text
        });
      }
    } 
    
    else {
      res.send(data);
    }
    // else res.send(data);
  });
};

// Find trending hashtags
exports.trendingHashtags = ({req, res}) => {
  Post.trendingHashtags(req.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving trending hashtags"
        });
      }
    } 
    
    else {
      res.send(data);
    }
    // else res.send(data);
  });
};

// Delete a Post with the specified id in the request
exports.delete = ({req, res}) => {
  Post.deletePies(req.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Post with id ${req.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Post with id " + req.id
        });
      }
    } else res.send(data);
  });
}

//Get all reported posts
exports.getReportedPosts = ({req, res}) => {
      //check if user has permissions to display all things
      async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Post.getReportedPosts((err, data) => {
              if (err) {
                if (err.kind === "not_found") {
                  res.status(404).send({
                    message: `Not found`
                  });
                } else {
                  res.status(500).send({
                    message: "Error retrieving reported posts"
                  });
                }
              } 
              
              else {
                res.send(data);
              }
              // else res.send(data);
            });
        }
        else {
            return res.status(403).send({
                success: 0,
                message: "You are not authorized to perform this action."
            })
        }
    }
    checkPermission();
}