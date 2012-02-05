var Models = {},
    Collections = {},
    hasManyNested,
    hasOneNested,
    hasOneAndManyNested,
    hasManyNotNested,
    hasOneNotNested,
    hasOneAndManyNotNested;

beforeEach(function(){
  Models.Author = Backbone.Model.extend();
  Models.PublishingHouse = Backbone.Model.extend();

  Collections.Pages = Backbone.RailsNestedAttributesCollection.extend();
  Collections.CustomerReviews = Backbone.RailsNestedAttributesCollection.extend();
  
  hasManyNested = {
    hasMany: {
      pages: {
        collection: Collections.Pages
      },
      customerReviews: {
        collection: Collections.CustomerReviews
      }
    }
  };

  hasOneNested = {
    hasOne: {
      author: {
        model: Models.Author
      },
      publishingHouse: {
        model: Models.PublishingHouse
      }
    }
  };

  hasOneAndManyNested = _.extend(hasManyNested, hasOneNested);
  
  hasManyNotNested = {
    hasMany: {
      pages: {
        collection: Collections.Pages,
        asNestedAttributes: false
      },
      customerReviews: {
        collection: Collections.CustomerReviews,
        asNestedAttributes: false
      }
    }
  };

  hasOneNotNested = {
    hasOne: {
      author: {
        model: Models.Author,
        asNestedAttributes: false
      },
      publishingHouse: {
        model: Models.PublishingHouse,
        asNestedAttributes: false
      }
    }
  };

  hasOneAndManyNotNested = _.extend(hasManyNotNested, hasOneNotNested);
});