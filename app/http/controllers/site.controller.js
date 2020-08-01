const SiteController = () => ({
  
  index: async (req, res, next) => {
    res.render('site/index');
  },
  
});

module.exports = SiteController;
