export class UserAlreadyExistsError extends Error {
    constructor() {
      super("User already exists");
      this.name = "UserAlreadyExistsError";
    }
  }
  
  export class ErrorCreatingUser extends Error {
    constructor() {
      super("Error creating user");
      this.name = "ErrorCreatingUser";
    }
  }
  
  export class ErrorDeletingUser extends Error {
    constructor() {
      super("Error deleting user");
      this.name = "ErrorDeletingUser";
    }
  }
  
  export class RestaurantAlreadyExistsError extends Error {
    constructor() {
        super("Restaurant already exists");
        this.name = "RestaurantAlreadyExistsError";
    }
}

export class ErrorCreatingRestaurant extends Error {
    constructor() {
        super("Error creating restaurant");
        this.name = "ErrorCreatingRestaurant";
    }
}

export class ErrorListingRestaurants extends Error {
  constructor() {
      super("Error Listing restaurants");
      this.name = "ErrorListingRestaurants";
  }
}

export class ErrorDeletingRestaurant extends Error {
  constructor() {
    super("Error deleting Resturant");
    this.name = "ErrorDeletingResturant";
  }
}