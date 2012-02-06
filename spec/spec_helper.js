var Models = {},
    Collections = {},
    nestedAssociations,
    nonNestedAssociations,
    sampleBook = {
      pages: [{one:1}, {two:2}],
      customer_reviews: [{one:'great'},{two:'mediocre'},{three:'soso'}],
      author: {name:'John Doe', phone: '123-456-7890'},
      publishing_house: {name: 'Books co.', phone: '012-345-6789'}
    };

beforeEach(function(){
  Models.Author = Backbone.Model.extend();
  Models.PublishingHouse = Backbone.Model.extend();

  Collections.Pages = Backbone.RailsNestedAttributesCollection.extend();
  Collections.CustomerReviews = Backbone.RailsNestedAttributesCollection.extend();
  
  nestedAssociations = {
    hasMany: {
      pages: {
        collection: Collections.Pages
      },
      customerReviews: {
        collection: Collections.CustomerReviews
      }
    },
    hasOne: {
      author: {
        model: Models.Author
      },
      publishingHouse: {
        model: Models.PublishingHouse
      }
    }
  };

  nonNestedAssociations = {
    hasMany: {
      pages: {
        collection: Collections.Pages,
        asNestedAttributes: false
      },
      customerReviews: {
        collection: Collections.CustomerReviews,
        asNestedAttributes: false
      }
    },
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

});