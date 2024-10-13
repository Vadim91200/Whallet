module suisocialapp::AccountModule {
    use sui::object::{UID, Self};

    /// Defines a `Parent` with a unique ID and a vector of `Child` references.
    public struct Parent has key, store {
        id: UID,
        name: vector<u8>,
        children: vector<Child>,
    }

    public struct Expense has store {
        description: vector<u8>,
        amount: u64,
        paid: bool,
    }

    /// Defines a `Child` with a unique ID, a balance, and a list of `Task` references.
    public struct Child has key, store {
        id: UID,
        name: vector<u8>,
        tasks: vector<Task>,
        expenses: vector<Expense>,
    }

    /// Defines a `Task` with a description and completion status.
    public struct Task has store {
        title: vector<u8>,
        is_completed: bool,

    }

    /// Creates a new `Parent` instance with an empty list of children.
    public fun create_parent(name: vector<u8>, ctx: &mut TxContext) {
        let id = object::new(ctx); // Initialize the UID here
        let parent = Parent {
            id: id,
            name: name,
            children: vector::empty<Child>(),
        };
        transfer::public_transfer(parent, tx_context::sender(ctx)); // Use public_transfer for objects with store ability
    }
        

    /// Creates a new `Child` instance with an initial balance of 0 and an empty task list.
    public fun create_child(name: vector<u8>, parent: &mut Parent, ctx: &mut TxContext) {
        let id = object::new(ctx);
        let child = Child {
            id: id,
            name: name,
            tasks: vector::empty<Task>(),
            expenses: vector::empty<Expense>(),
        };
        vector::push_back(&mut parent.children, child);
    }

    /// Creates a new `Task` with a given description and an incomplete status.
    public fun create_task(child: &mut Child, title: vector<u8>) {
        vector::push_back(&mut child.tasks, Task {
            title,
            is_completed: false,
        });
    }
}