/**
*
*
*   A model that allows has_one and has_many associations
*
*   Associations are defined in the `class` definition using:
*
*   var Book = Backbone.RailsModel.extend({
*     hasMany: {
*       pages: {
*         collection: Pages
*       },
*       customerReviews: {
*         collection: CustomerReviews
*       }
*     },
*     hasOne: {
*       publishingHouse: {
*         model: PublishingHouse
*       }
*     }
*   });
*
*   Note that we specify our associations using the Javascript camelcased convention
*   The json coming in is expected to use the rails underscored convention however.
*
*   For example, one would populate the above Book object using
*
*   var book = new Book( {customer_reviews: [{one:1}, {two:2}]} )
*
*/
(function(){
  
  /**
  *
  *   Some String utility functions to work with camelCase and underscore strings
  *
  */
  var 
      /**
      *
      *   @private
      *   
      *   Trim whitespace from the front and back of a string
      */
      trim = String.prototype.trim || function(){
        return this.replace(/^\s+|\s+$/g, '') ;
      },
      /**
      *
      *   @private
      *   @param {String} string The string to be converted
      *
      *   Convert underscored string into camelcase (taken from undescore.string.js)
      */
      camelize = function(string){
        return trim.call(string).replace(/(\-|_|\s)+(.)?/g, function(match, separator, chr) {
          return chr ? chr.toUpperCase() : '';
        });
      },
      /**
      *
      *   @private
      *   @param {String} string The string to be converted      
      *
      *   Convert camelcased string into underscored (taken from undescore.string.js)
      */
      underscored = function(string){
        return trim.call(string).
          replace(/([A-Z\d]+)([A-Z][a-z])/, '$1_$2').
          replace(/([a-z\d])([A-Z]+)/g, '$1_$2').
          replace(/\-|\s+/g, '_').toLowerCase();
      };
    
    var 
      /**
      *   @private
      *   @binding {Backbone.RailsModel}
      *   @param {String} type Type of association to create
      *   @return {Function} to iterate over associations and create them
      *
      *   Creates the associated model and populates it with data
      *   Note this is not set on attributes, but directly on the model itself
      *
      */
      createAssociation = function(type){
        var self = this;
        
        return function(properties, association){
          var railsAssociation = underscored(association);
          self[association] = new properties[type](self.get( railsAssociation ));
          self.unset(railsAssociation, {silent: true});
        };
      };

  /**
  *
  *   @public
  *   @class
  *
  */
  Backbone.RailsModel = Backbone.Model.extend({

    /**
    *
    *   @private
    *
    *   Overridden constructor that is called automatically by Backbone
    *
    */
    constructor: function(){
      Backbone.Model.prototype.constructor.apply(this, arguments);

      _.each(this.hasMany, createAssociation.call(this, 'collection'));
      _.each(this.hasOne, createAssociation.call(this, 'model'));
    },

    /**
    *
    *   @public
    *   @return {Object} Serialized model with associations
    *
    *   Serialize a model and include all associations
    *
    */
    toJSON: function(){
      var self = this,
          attrs = _.clone(this.attributes);

      _.each(_.extend({}, this.hasOne, this.hasMany), function(properties, association){

        // checking for either: length (if collection), or populated attributes (if model)
        if ( self[association].length || !_.isEmpty(self[association].attributes)){
          var associationKey = underscored(association) + (properties.asNestedAttributes === false ? "" : "_attributes");
          attrs[associationKey] = self[association].toJSON();
        }
      });

      return attrs;
    }

  });

})();