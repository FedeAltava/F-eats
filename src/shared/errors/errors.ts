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

export class ErrorUpdatingRestaurant extends Error {
  constructor() {
    super("Error updating restaurant");
    this.name = "ErrorUpdatingRestaurant";
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export class ErrorListingUsers extends Error {
  constructor() {
    super("Error listing users");
    this.name = "ErrorListingUsers";
  }
}

export class ErrorUpdatingUser extends Error {
  constructor() {
    super("Error updating user");
    this.name = "ErrorUpdatingUser";
  }
}

export class ErrorCreatingDish extends Error {
  constructor() {
    super("Error creating dish");
    this.name = "ErrorCreatingDish";
  }
}

export class ErrorUpdatingDish extends Error {
  constructor() {
    super("Error updating dish");
    this.name = "ErrorUpdatingDish";
  }
}

export class ErrorDeletingDish extends Error {
  constructor() {
    super("Error deleting dish");
    this.name = "ErrorDeletingDish";
  }
}

export class DishNotFoundError extends Error {
  constructor() {
    super("Dish not found");
    this.name = "DishNotFoundError";
  }
}

export class ErrorListingDishes extends Error {
  constructor() {
    super("Error listing dishes");
    this.name = "ErrorListingDishes";
  }
}
