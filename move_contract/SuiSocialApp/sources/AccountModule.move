module suisocialapp::AccountModule {
    use sui::object::{UID, Self};
    
    /// Defines a `Parent` with a unique ID and a vector of `Child` references.
    public struct Parent has key, store {
        id: UID,
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
        tasks: vector<Task>,
        expenses: vector<Expense>,
        multisig_threshold: u8,
    }

    /// Defines a `Task` with a description and completion status.
    public struct Task has store {
        description: vector<u8>,
        is_completed: bool,
    }

    /// Creates a new `Parent` instance with an empty list of children.
    public fun create_parent(ctx: &mut TxContext): Parent {
        let id = object::new(ctx); // Initialize the UID here
        let parent = Parent {
            id,
            children: vector::empty<Child>(),
        }
        option::drop(parent);
    }
        

    /// Creates a new `Child` instance with an initial balance of 0 and an empty task list.
    public fun create_child(parent: &mut Parent, ctx: &mut TxContext) {
        let id = object::new(ctx);
        let child = Child {
            id: id,
            tasks: vector::empty<Task>(),
            expenses: vector::empty<Expense>(),
            multisig_threshold: 0,
        };
        vector::push_back(&mut parent.children, child);
    }

    /// Creates a new `Task` with a given description and an incomplete status.
    public fun create_task(child: &mut Child, description: vector<u8>) {
        vector::push_back(&mut child.tasks, Task {
            description,
            is_completed: false,
        });
    }
}