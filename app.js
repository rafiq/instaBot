require('dotenv').config()
const puppeteer =require('puppeteer')
const Instauto = require('instauto')

const options = {
  cookiesPath: './cookies.json',

  username: process.env.INSTA_USERNAME,
  password: process.env.INSTA_PASSWORD,

  // Global limit that prevents follow or unfollows (total) to exceed this number over a sliding window of one hour:
  maxFollowsPerHour: 20,
  // Global limit that prevents follow or unfollows (total) to exceed this number over a sliding window of one day:
  maxFollowsPerDay: 150,
  // (NOTE setting the above parameters too high will cause temp ban/throttle)

  maxLikesPerDay: 50,


  dontUnfollowUntilTimeElapsed: 3 * 24 * 60 * 60 * 1000,

  // Usernames that we should not touch, e.g. your friends and actual followings
  excludeUsers: [],

  // If true, will not do any actions (defaults to true)
  dryRun: true,
};

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: false });

    // Create a database where state will be loaded/saved to
    const instautoDb = await Instauto.JSONDB({
      // Will store a list of all users that have been followed before, to prevent future re-following.
      followedDbPath: './followed.json',
      // Will store all unfollowed users here
      unfollowedDbPath: './unfollowed.json',
      // Will store all likes here
      likedPhotosDbPath: './liked-photos.json',
    });

    const instauto = await Instauto(instautoDb, browser, options);

    // List of usernames that we should follow the followers of, can be celebrities etc.
    const usersToFollowFollowersOf = ['dedik_armawann'];

    // Now go through each of these and follow a certain amount of their followers
    await instauto.followUsersFollowers({ usersToFollowFollowersOf, skipPrivate: true, enableLikeImages: true });

    await instauto.sleep(10 * 60 * 1000);

    // This is used to unfollow people - auto-followed AND manually followed -
    // who are not following us back, after some time has passed
    // (config parameter dontUnfollowUntilTimeElapsed)
    await instauto.unfollowNonMutualFollowers();

    await instauto.sleep(10 * 60 * 1000);

    // Unfollow auto-followed users (regardless of whether they are following us)
    // after a certain amount of days
    await instauto.unfollowOldFollowed({ ageInDays: 60 });

    console.log('Done running');

    await instauto.sleep(30000);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('Closing browser');
    if (browser) await browser.close();
  }
})();