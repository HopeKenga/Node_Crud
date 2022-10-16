const sql = require("./db");
const _ = require('lodash');
const lodash = require('lodash');
const knex = require('knex')({
  client: 'mysql',
  version: '5.7',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '',
    database : 'tester'
  },
  pool:{min:0, max:5}
});

// constructor
const Post = function(post) {
    this.user_id = post.user_id;
    this.pie_user_id = post.pie_user_id;
    this.parent_id = post.parent_id;
    this.title = post.title;
    this.category = post.category;
    this.meal_event_id = post.meal_event_id;
    this.pies_text = post.pies_text;
    this.share_text = post.share_text;
    this.pies_media = post.pies_media;
    this.prev_title = post.prev_title;
    this.prev_image = post.prev_image;
    this.prev_url = post.prev_url;
    this.prev_desc = post.prev_desc;
    this.view_count = post.view_count;
    this.like_count = post.like_count;
    this.comment_count = post.comment_count;
    this.pies_type = post.pies_type;
    this.post_type = post.post_type;
    this.dimension = post.dimension;
    this.is_reported = post.is_reported;
    this.report_by = post.report_by;
    this.why_reporting = post.why_reporting;
    this.reporting_text = post.reporting_text;
    this.recipe = post.recipe;
    this.is_hide = post.is_hide;
    this.is_deleted = post.is_deleted;
    this.creation_datetime = post.creation_datetime;
    this.modification_datetime = post.modification_datetime;
    this.deletion_datetime = post.deletion_datetime;
};

//Creating a new post
Post.create = (newPost, result) => {
  async function createPost() {
    try {
      const rows = await knex('pies_master').insert(newPost);
      if(newPost.parent_id !==0 || newPost.post_type === 'shared' || newPost.post_type === 'meal') {
        const UserDetails = await knex('user_master').select().where({'user_id': newPost.user_id})
        const follow = await knex('pie_mate_master').select().where({'mate_for': newPost.pie_user_id}).where({'mate_by': newPost.user_id});
        const followStatus = await knex('pie_mate_master').select().where({'mate_for': newPost.user_id}).where({'mate_by': newPost.pie_user_id});
        const followDetails = {
          'follow': follow.length > 0 ? 1 : 0,
          'followStatus': followStatus.length > 0 ? 1 : 0,
        }
        const MealEventDetails = await knex('meal_master')
        .join('currency', function () {
          this
            .on('meal_master.currency', '=', 'currency.number')
        })
        .join('user_master', function () {
          this
            .on('meal_master.user_id', '=', 'user_master.user_id')
        })
        .select()
        .where({'id': newPost.meal_event_id})

        //const combined =  {id: rows, ...newPost, share_user: UserDetails[0]}
        const combined = {
          id:rows[0],
          share_profile_status: UserDetails[0].profile_status,
          share_piematecount: UserDetails[0].countpiemates,
          share_profile_pic: UserDetails[0].profile_pic,
          share_first_name: UserDetails[0].first_name,
          share_status: UserDetails[0].status,
          share_last_name: UserDetails[0].last_name,
          share_username: UserDetails[0].user_name,
          share_wallet: UserDetails[0].wallet,
          share_recipe: newPost.recipe,
          follow_details: followDetails,
          meal: MealEventDetails[0],
          ...newPost,
        }

        result(null, combined);
      } else {
        result(null, {id: rows, ...newPost});
      }
      
    } catch (error) {
      result(null, error);
    }
  }

  createPost()
};

Post.updateById = (id, post, result) => {
  //checking if post is already hidden by user
    async function checkHide() {
      const check = await knex('pies_master').where({
          id: id,
      }).select();
      
      if (check[0].is_hide === 1) {
          unHide()
      } else {
          Hide()
      }
  }
  //hiding a post
  async function Hide() {
      sql.query(
        "UPDATE pies_master SET is_hide = 1 WHERE id = ?",
        id,
        (err, res) => {
          if (err) {
            result(null, {"lang": "EN", "message": "Pie hidden failure", "success": 0});
            return;
          }
          if (res.affectedRows == 0) {
            // not found Post with the id
            result({ kind: "not_found" }, null);
            return;
          }
          result(null, {"lang": "EN", "message": "Pie hidden successfully", "hidden": 1});
          return;
        }
      );
  }

  //unhiding a post
  async function unHide() {
    sql.query(
      "UPDATE pies_master SET is_hide = 0 WHERE id = ?",
      id,
      (err, res) => {
        if (err) {
          result(null, {"lang": "EN", "message": "Pie unhide failure", "success": 0});
          return;
        }
        if (res.affectedRows == 0) {
          // not found Post with the id
          result({ kind: "not_found" }, null);
          return;
        }
        result(null, {"lang": "EN", "message": "Pie unhidden successfully", "hidden": 0});
        return;
      }
    );
  }

  checkHide();
};

Post.findById = (id, result, pagenumber=0) => {
  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
  
    return previous;
  }
  async function getAllPostsWithComments() {
    const p = getPreviousDay()
    const posts = await knex('pies_master')
      .join('user_master', function() {
          this
            .on('user_master.user_id', '=', 'pies_master.user_id')
        })
      .join('pie_mate_master', function() {
          this
            .on('pie_mate_master.mate_by', '=', 'pies_master.user_id')
        })
        .select(
          'pies_master.*',
          'pies_master.id as pies_master_id',
          knex.raw('IF(pies_master.parent_id != 0, user_master.profile_status, null) AS share_profile_status'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.countpiemates, null) AS share_piematecount'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.profile_pic, null) AS share_profile_pic'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.first_name, null) AS share_first_name'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.status, null) AS share_status'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.last_name, null) AS share_last_name'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.user_name, null) AS share_username'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.wallet, null) AS share_wallet'),
          'pie_mate_master.mate_for as pie_mate_master_mate_for')
        .where({'pie_mate_master.mate_for': id})
        .where({'pies_master.is_deleted' : 0})
        .where({'pies_master.is_reported' : 0})
        .where('pies_master.modification_datetime', '>', p)
        .limit(7).orderBy('modification_datetime', 'desc')
    // const p = posts.orderBy('like_count', 'desc')
    const postsIds = _.map(posts, (el) => el.id);
    const mealIds = _.map(posts, (el) => el.meal_event_id);

    const MealEventDetails = await knex('meal_master')
    .join('currency', function () {
      this
        .on('meal_master.currency', '=', 'currency.number')
    })
    .select().whereIn('id', mealIds)
    const groupedMeals = _.groupBy(MealEventDetails, 'id');

    const Comments = await knex('pie_comment_master').select().whereIn('pie_id', postsIds).limit(7)
    const groupedComments = _.groupBy(Comments, 'pie_id');

    const postsEmbedded = _.map(posts, (record) => {
            return {
                ...record,
                meal: groupedMeals[record.meal_event_id],
                comments_list: groupedComments[record.id],
            };
        });

    return postsEmbedded
  }

  async function getPostsWithMostLikes() {
    const p = getPreviousDay()
    const posts = await knex('pies_master')
      .join('user_master', function() {
          this
            .on('user_master.user_id', '=', 'pies_master.user_id')
        })
        .select(
          'pies_master.*',
          'pies_master.id as pies_master_id',
          knex.raw('IF(pies_master.parent_id != 0, user_master.profile_status, null) AS share_profile_status'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.countpiemates, null) AS share_piematecount'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.profile_pic, null) AS share_profile_pic'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.first_name, null) AS share_first_name'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.status, null) AS share_status'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.last_name, null) AS share_last_name'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.user_name, null) AS share_username'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.wallet, null) AS share_wallet'),
          )
        .where({'pies_master.is_deleted' : 0})
        .where('pies_master.modification_datetime', '>', p)
        .limit(7).orderBy('like_count', 'desc')
    // const p = posts.orderBy('like_count', 'desc')
    const postsIds = _.map(posts, (el) => el.id);
    const mealIds = _.map(posts, (el) => el.meal_event_id);

    const MealEventDetails = await knex('meal_master')
    .join('currency', function () {
      this
        .on('meal_master.currency', '=', 'currency.number')
    })
    .select().whereIn('id', mealIds)
    const groupedMeals = _.groupBy(MealEventDetails, 'id');

    const Comments = await knex('pie_comment_master').select().whereIn('pie_id', postsIds).limit(7)
    const groupedComments = _.groupBy(Comments, 'pie_id');

    const postsWithMostLikesEmbedded = _.map(posts, (record) => {
            return {
                ...record,
                meal: groupedMeals[record.meal_event_id],
                comments_list: groupedComments[record.id],
            };
        });

    array = postsWithMostLikesEmbedded.sort(function (a, b) {
      return b.like_count - a.like_count ;
    });

    // result(null, postsWithMostLikesEmbedded);
    // return;
    return postsWithMostLikesEmbedded;
  }

  async function getRecentLikedPostsFromFollowing() {
    const following = await knex('pie_mate_master').select().where({'mate_for': id}).where({'status': 0})
    const followingIds = _.map(following, (el) => el.mate_by);
    
    const likes = await knex('pies_like_master').select().whereIn('user_id', followingIds)
    const likesIds = _.map(likes, (el) => el.pie_id);

    // const posts1 = await knex('pies_master')
    // .select()
    // .whereIn('id', likesIds)
    // .where({'is_deleted' : 0})
    // .orderBy('modification_datetime', 'desc')

    const posts = await knex('pies_master')
      .join('user_master', function() {
          this
            .on('user_master.user_id', '=', 'pies_master.user_id')
        })
        .select(
          'pies_master.*',
          'pies_master.id as pies_master_id',
          knex.raw('IF(pies_master.parent_id != 0, user_master.profile_status, null) AS share_profile_status'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.countpiemates, null) AS share_piematecount'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.profile_pic, null) AS share_profile_pic'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.first_name, null) AS share_first_name'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.status, null) AS share_status'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.last_name, null) AS share_last_name'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.user_name, null) AS share_username'),
          knex.raw('IF(pies_master.parent_id != 0, user_master.wallet, null) AS share_wallet'),
          )
        .whereIn('id', likesIds)
        .where({'pies_master.is_deleted' : 0})
        .limit(15).orderBy('modification_datetime', 'desc')
    // const p = posts.orderBy('like_count', 'desc')
      const postsIds = _.map(posts, (el) => el.id);
      const mealIds = _.map(posts, (el) => el.meal_event_id);

      const MealEventDetails = await knex('meal_master')
      .join('currency', function () {
        this
          .on('meal_master.currency', '=', 'currency.number')
      })
      .select().whereIn('id', mealIds)
      const groupedMeals = _.groupBy(MealEventDetails, 'id');

      const Comments = await knex('pie_comment_master').select().whereIn('pie_id', postsIds).limit(7)
      const groupedComments = _.groupBy(Comments, 'pie_id');

      const postsFromFollowingEmbedded = _.map(posts, (record) => {
              return {
                  ...record,
                  meal: groupedMeals[record.meal_event_id],
                  comments_list: groupedComments[record.id],
              };
          });

    return postsFromFollowingEmbedded;
  }

  async function combineAllAlgorithms() {
    const mostLikes = await getPostsWithMostLikes();
    const fromFollowers = await getAllPostsWithComments();
    const fromFollowing = await getRecentLikedPostsFromFollowing();

    concated = _.concat(mostLikes, fromFollowers, fromFollowing);
    let n = 20;
    var shuffled = concated.sort(function(){return .5 - Math.random()});
    var selected=shuffled.slice(0,n);


    result(null, selected);
    return;
  }

  // combineAllAlgorithms()
  getAllPostsWithComments()
  // getPostsWithMostLikes()
  // getRecentLikedPostsFromFollowing()
}

Post.searchPies = (text, result) => {
  async function Search() {
    const posts = await knex('pies_master')
    .join('user_master', function() {
      this
        .on('user_master.user_id', '=', 'pies_master.user_id')
    })
    .select(
      'pies_master.*',
      'pies_master.id as pies_master_id',
      knex.raw('IF(pies_master.parent_id != 0, user_master.profile_status, null) AS share_profile_status'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.countpiemates, null) AS share_piematecount'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.profile_pic, null) AS share_profile_pic'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.first_name, null) AS share_first_name'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.status, null) AS share_status'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.last_name, null) AS share_last_name'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.user_name, null) AS share_username'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.wallet, null) AS share_wallet'),
    )
    .whereLike('pies_text', `%${text}%`)
    .where({'pies_master.is_deleted' : 0})
    .orderBy('pies_master.modification_datetime', 'desc')

    const postsIds = _.map(posts, (el) => el.id);
    const mealIds = _.map(posts, (el) => el.meal_event_id);

    const MealEventDetails = await knex('meal_master')
    .join('currency', function () {
      this
        .on('meal_master.currency', '=', 'currency.number')
    })
    .select().whereIn('id', mealIds)
    const groupedMeals = _.groupBy(MealEventDetails, 'id');

    const Comments = await knex('pie_comment_master').select().whereIn('pie_id', postsIds).limit(7)
    const groupedComments = _.groupBy(Comments, 'pie_id');

    const postsEmbedded = _.map(posts, (record) => {
            return {
                ...record,
                meal: groupedMeals[record.meal_event_id],
                comments_list: groupedComments[record.id],
            };
        });

    result(null, postsEmbedded);
  }
  Search()
}

Post.searchRecipes = (text, result) => {
  async function Search() {
    const posts = await knex('pies_master')
    .join('user_master', function() {
      this
        .on('user_master.user_id', '=', 'pies_master.user_id')
    })
    .select(
      'pies_master.*',
      'pies_master.id as pies_master_id',
      knex.raw('IF(pies_master.parent_id != 0, user_master.profile_status, null) AS share_profile_status'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.countpiemates, null) AS share_piematecount'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.profile_pic, null) AS share_profile_pic'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.first_name, null) AS share_first_name'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.status, null) AS share_status'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.last_name, null) AS share_last_name'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.user_name, null) AS share_username'),
      knex.raw('IF(pies_master.parent_id != 0, user_master.wallet, null) AS share_wallet'),
    )
    .whereLike('recipe', `%${text}%`)
    .where({'pies_master.is_deleted' : 0})
    .orderBy('pies_master.modification_datetime', 'desc')

    const postRecipes = await knex('pies_master')
    .select('id', 'recipe')
    .whereLike('recipe', `%${text}%`)
    .where({'pies_master.is_deleted' : 0})
    .orderBy('pies_master.modification_datetime', 'desc')

    
    //convert pIds from stringify to parse
    const groupedParsed = _.groupBy(postRecipes, 'id');
    //convert groupedParsed from stringify to parse
    const groupedParsedParse = _.mapValues(groupedParsed, (el) => _.map(el, (el) => JSON.parse(el.recipe)));

    //const groupedPIds = _.groupBy(pIdsParse, 'id');

    const postsIds = _.map(posts, (el) => el.id);
    const mealIds = _.map(posts, (el) => el.meal_event_id);

    const MealEventDetails = await knex('meal_master')
    .join('currency', function () {
      this
        .on('meal_master.currency', '=', 'currency.number')
    })
    .select().whereIn('id', mealIds)
    const groupedMeals = _.groupBy(MealEventDetails, 'id');

    const Comments = await knex('pie_comment_master').select().whereIn('pie_id', postsIds).limit(7)
    const groupedComments = _.groupBy(Comments, 'pie_id');

    const postsEmbedded = _.map(posts, (record) => {
            return {
                ...record,
                recipe: groupedParsedParse[record.id],
                meal: groupedMeals[record.meal_event_id],
                comments_list: groupedComments[record.id],
            };
        });

    result(null, postsEmbedded);
  }
  Search()
}

Post.trendingHashtags = (id, result) => {
  async function TrendingHashtags() {
    const interests = await knex('user_master').select('things_ids').where({'user_id' : id})
    const interestsIds = _.map(interests, (el) => el.things_ids);
    const interestsIdsArray = _.split(interestsIds, ',');
    const posts = await knex('pies_master')
    .join('hashtag_master', function () {
      this
        .on('pies_master.category', '=', 'hashtag_master.id')
    })
    .select(
      'hashtag_master.hashtag',
      knex.raw('count(*) as occurence')
    )
    .whereIn('category', interestsIdsArray)
    .where({'pies_master.is_deleted' : 0})
    .orderBy('occurence', 'desc')
    .groupBy('category')
    const hashtags = await knex('hashtag_master')
    .select(
      'hashtag',
      knex.raw('count(*) as occurence')
    )
    .whereIn('id', interestsIdsArray)
    .where({'is_deleted' : 0})
    .orderBy('occurence', 'desc')
    .groupBy('hashtag')

    result(null, posts);
  }
  TrendingHashtags()
}

Post.deletePies = (id, result) => {
  async function DeletePies() {
    const post = await knex('pies_master').update({'is_deleted' : 1, deletion_datetime: new Date()}).where({'id' : id})
    result(null, {
      lang: "EN",
      message: "Pies Deleted Successful.",
      success: 1
  });
  }
  DeletePies()
}

//getting all the reported posts
Post.getReportedPosts = (result) => {
  async function GetReportedPosts() {
    const posts = await knex('pies_master').select().where({'is_reported' : 1})
    const reportedIds = _.map(posts, (el) => el.why_reporting);
    const reportedByIds = _.map(posts, (el) => el.report_by);
    const reports = await knex('report_post_master').select().whereIn('id', reportedIds)
    const groupedReports = _.groupBy(reports, 'id');

    //convert pies_media from string to array using split for each pie
    const groupedPies = _.mapValues(posts, (el) => _.split(el.pies_media, ','));
    
    //reported by
    const reportedBy = await knex('user_master').select().whereIn('user_id', reportedByIds)
    const groupedReportedBy = _.groupBy(reportedBy, 'user_id');

    const postsEmbedded = _.map(posts, (record, index) => {
            return {
                ...record,
                pies_media: groupedPies[index],
                report: groupedReports[record.why_reporting],
                reporter: groupedReportedBy[record.report_by],
            };
        });
    result(null, postsEmbedded);
  }
  GetReportedPosts()
}
module.exports = Post;
