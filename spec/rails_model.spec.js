/**
*
*
*   Testing the RailsModel
*   See spec_helper.js for model and colleciton defn's
*
*/
describe("RailsModel", function() {
  var book,
      Book;
      
  beforeEach(function(){
    Book = Backbone.RailsModel.extend();
  });

  // since we override the constructor
  it("should behave like a Backbone Model", function() {
    book = new Book();
    expect(book instanceof Backbone.Model).toBeTruthy();
    expect(book.attributes).toBeDefined();
  });

  describe("Associations Using Nested Attributes", function() {
    
    beforeEach(function() {
      Book = Backbone.RailsModel.extend(nestedAssociations);
    });

    describe("Empty model", function() {
      beforeEach(function() {
        book = new Book();
      });

      it("should have collections set", function() {
        expect(book.pages instanceof Collections.Pages).toBeTruthy();
        expect(book.customerReviews instanceof Collections.CustomerReviews).toBeTruthy();
      });
      
      it("should have models set", function(){
        expect(book.author instanceof Models.Author).toBeTruthy();
        expect(book.publishingHouse instanceof Models.PublishingHouse).toBeTruthy();
      });

      describe("serialization", function() {
        it("should not contain the collections", function() {
          expect(book.toJSON().pages_attributes).toBeUndefined();
          expect(book.toJSON().customer_reviews_attributes).toBeUndefined();
        });
        
        it("should not contain the models", function() {
          expect(book.toJSON().author_attributes).toBeUndefined();
          expect(book.toJSON().publishing_house_attributes).toBeUndefined();
        });
      });

    });

    describe("Populated model", function() {
      beforeEach(function() {
        book = new Book(sampleBook);
      });

      it("should have a populated each collection", function() {
        expect(book.pages.length).toEqual(2);
        expect(book.pages.at(0).get('one')).toEqual(1);
        expect(book.pages.at(1).get('two')).toEqual(2);

        expect(book.customerReviews.length).toEqual(3);
        expect(book.customerReviews.at(0).get('one')).toEqual('great');
        expect(book.customerReviews.at(1).get('two')).toEqual('mediocre');
        expect(book.customerReviews.at(2).get('three')).toEqual('soso');
      });
      
      it("should have populated each model", function(){
        expect(book.author.get('name')).toEqual('John Doe');
        expect(book.publishingHouse.get('name')).toEqual('Books co.');
      });

      it("should not have the passed in collection names set as attributes", function(){
        expect(book.get('pages')).toBeUndefined();
        expect(book.get('customer_reviews')).toBeUndefined();
      });
      
      it("should not have the passed in model names set as attributes", function(){
        expect(book.get('author')).toBeUndefined();
        expect(book.get('publishing_house')).toBeUndefined();
      });

      describe("serialization", function() {
        it("should have both collection's attributes", function() {
          expect(book.toJSON().pages_attributes).toBeDefined();
          expect(book.toJSON().pages_attributes[0].one).toEqual(1);
          
          expect(book.toJSON().customer_reviews_attributes).toBeDefined();
          expect(book.toJSON().customer_reviews_attributes[0].one).toEqual('great');
        });
        
        it("should have model attributes set", function(){
          expect(book.toJSON().author_attributes).toBeDefined();
          expect(book.toJSON().author_attributes.name).toEqual('John Doe');
          
          expect(book.toJSON().publishing_house_attributes).toBeDefined();
          expect(book.toJSON().publishing_house_attributes.name).toEqual('Books co.');
        });

        it("should not have pages or customer_reviews", function() {
          expect(book.toJSON().pages).toBeUndefined();
          expect(book.toJSON().customer_reviews).toBeUndefined();
        });
        
        it("should not have author or publishing_house", function() {
          expect(book.toJSON().author).toBeUndefined();
          expect(book.toJSON().publishing_house).toBeUndefined();
        });
      });
    });
  });
  
  describe("Associations Without Using Nested Attributes", function() {
    
    beforeEach(function() {
      Book = Backbone.RailsModel.extend(nonNestedAssociations);
    });

    describe("serialization", function(){
      
      describe("empty model", function(){
        beforeEach(function(){
          book = new Book();
        });

        it("should not include collections", function() {
          expect(book.toJSON().pages).toBeUndefined();
          expect(book.toJSON().customer_reviews).toBeUndefined();
        });
        
        it("should not include models", function() {
          expect(book.toJSON().author).toBeUndefined();
          expect(book.toJSON().publishing_house).toBeUndefined();
        });
      });
      
      describe("populated model", function() {
        beforeEach(function() {
          book = new Book(sampleBook);
        });

        it("should include collections", function(){
          expect(book.toJSON().pages).toBeDefined();
          expect(book.toJSON().pages[0].one).toEqual(1);
          
          expect(book.toJSON().customer_reviews).toBeDefined();
          expect(book.toJSON().customer_reviews[0].one).toEqual('great');
        });
        
        it("should include models", function(){
          expect(book.toJSON().author).toBeDefined();
          expect(book.toJSON().author.name).toEqual('John Doe');
          
          expect(book.toJSON().publishing_house).toBeDefined();
          expect(book.toJSON().publishing_house.name).toEqual('Books co.');
        });

        it("should not have _attributes collections", function() {
          expect(book.toJSON().pages_attributes).toBeUndefined();
          expect(book.toJSON().customer_reviews_attributes).toBeUndefined();
        });
        
        it("should not have _attributes models", function() {
          expect(book.toJSON().author_attributes).toBeUndefined();
          expect(book.toJSON().publishing_house_attributes).toBeUndefined();
        });
      });
    });
  });
});