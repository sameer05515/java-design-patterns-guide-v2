window.DESIGN_PATTERNS = [
  {
    "id": "singleton",
    "name": "Singleton",
    "category": "Creational",
    "short": "SING",
    "summary": "Ensure a class has one shared instance.",
    "explanation": "Use one centrally accessible instance when the domain truly requires shared identity or coordination. Prefer dependency injection for ordinary application services.",
    "caution": "Singletons can make testing and global state harder. Java enums are a concise, serialization-safe singleton implementation.",
    "useCases": [
      "Global configuration, one process-wide registry, or a carefully controlled resource coordinator.",
      "Spring beans are singleton-scoped by default within an application context; this is not the same as a JVM-wide enum singleton."
    ],
    "spring": "Spring beans are singleton-scoped by default within an application context; this is not the same as a JVM-wide enum singleton.",
    "goal": "Ensure a class has one shared instance.",
    "code": "public enum AppConfig {\n    INSTANCE;\n\n    public String appName() {\n        return \"Question Bank\";\n    }\n}\n\n// Usage\nString name = AppConfig.INSTANCE.appName();",
    "exampleTitle": "Singleton.java",
    "interview": "Distinguish a GoF singleton from Spring's default singleton bean scope. The latter means one bean instance per application context.",
    "intent": "Control access to a single shared instance when shared identity is a real requirement.",
    "problem": "If many callers independently construct the same coordinator or registry, state can diverge and resources may be duplicated.",
    "structure": [
      "Singleton type owns or exposes the instance.",
      "Client asks the singleton for access instead of constructing it repeatedly."
    ],
    "tradeoffs": [
      "Can introduce global state and hidden dependencies.",
      "Can make tests order-dependent if mutable state is shared.",
      "Enum singletons are concise and handle serialization robustly."
    ],
    "relatedPatterns": "Factory Method (creation), Dependency Injection (controlled object lifecycle).",
    "scenario": "A small immutable application-wide registry is a better candidate than ordinary Spring services, which are normally managed by dependency injection.",
    "learningQuestions": [
      "What problem does Singleton solve?",
      "What changes in the design if Singleton is not used?",
      "What is one trade-off of using Singleton?"
    ]
  },
  {
    "id": "factory-method",
    "name": "Factory Method",
    "category": "Creational",
    "short": "FACT",
    "summary": "Define an interface for creating an object while allowing subclasses to choose the concrete type.",
    "explanation": "Client code works with a common interface instead of constructing concrete classes directly. This sample shows the core factory idea; a classic Factory Method often delegates creation to subclasses.",
    "caution": "Avoid a factory when a direct constructor is clear and there are only one or two stable implementations.",
    "useCases": [
      "When concrete product selection varies by configuration, environment, or extension point.",
      "Spring's BeanFactory creates and supplies managed beans; many framework extension points use factory-style creation."
    ],
    "spring": "Spring's BeanFactory creates and supplies managed beans; many framework extension points use factory-style creation.",
    "goal": "Define an interface for creating an object while allowing subclasses to choose the concrete type.",
    "code": "interface Notification {\n    void send(String message);\n}\n\nclass EmailNotification implements Notification {\n    public void send(String message) {\n        System.out.println(\"Email: \" + message);\n    }\n}\n\nclass NotificationFactory {\n    static Notification create(String type) {\n        if (\"email\".equalsIgnoreCase(type)) {\n            return new EmailNotification();\n        }\n        throw new IllegalArgumentException(type);\n    }\n}",
    "exampleTitle": "FactoryMethod.java",
    "interview": "Be ready to distinguish Simple Factory (a common idiom) from the formal GoF Factory Method pattern.",
    "intent": "Let a creator defer the choice of concrete product to a specialized creation method.",
    "problem": "Client code becomes coupled to concrete classes when it directly calls constructors in many places.",
    "structure": [
      "Product interface defines the contract.",
      "Concrete products implement that contract.",
      "Creator declares a factory method; concrete creators choose the product."
    ],
    "tradeoffs": [
      "Adds types and indirection.",
      "Pays off when product selection varies or extension points are important.",
      "A simple factory function may be enough for small applications."
    ],
    "relatedPatterns": "Abstract Factory (families of products), Builder (step-by-step construction).",
    "scenario": "A document importer chooses CSV, JSON, or XML parsers based on the incoming file type.",
    "learningQuestions": [
      "What problem does Factory Method solve?",
      "What changes in the design if Factory Method is not used?",
      "What is one trade-off of using Factory Method?"
    ]
  },
  {
    "id": "abstract-factory",
    "name": "Abstract Factory",
    "category": "Creational",
    "short": "AF",
    "summary": "Create families of related objects without specifying their concrete classes.",
    "explanation": "A factory returns a compatible family of products, such as buttons and checkboxes for one UI theme.",
    "caution": "Useful when products must vary together; unnecessary if there is only one product type.",
    "useCases": [
      "Cross-platform UI widgets, database-specific components, or cloud-provider-specific clients.",
      "Spring configuration classes can assemble related bean families, though they are not automatically GoF abstract factories."
    ],
    "spring": "Spring configuration classes can assemble related bean families, though they are not automatically GoF abstract factories.",
    "goal": "Create families of related objects without specifying their concrete classes.",
    "code": "interface Button { void render(); }\ninterface Checkbox { void render(); }\n\ninterface WidgetFactory {\n    Button createButton();\n    Checkbox createCheckbox();\n}\n\nclass DarkButton implements Button {\n    public void render() { System.out.println(\"Dark button\"); }\n}\nclass DarkCheckbox implements Checkbox {\n    public void render() { System.out.println(\"Dark checkbox\"); }\n}\nclass DarkWidgetFactory implements WidgetFactory {\n    public Button createButton() { return new DarkButton(); }\n    public Checkbox createCheckbox() { return new DarkCheckbox(); }\n}",
    "exampleTitle": "AbstractFactory.java",
    "interview": "The key phrase is a family of related products, not merely creating one object.",
    "intent": "Create compatible families of related products without exposing their concrete classes.",
    "problem": "Mixing products from different families can produce inconsistent behavior or styling.",
    "structure": [
      "Abstract factory declares creation methods for each product type.",
      "Concrete factories create one compatible family.",
      "Client depends only on abstract product and factory interfaces."
    ],
    "tradeoffs": [
      "Adding a new product family is easy.",
      "Adding a new product kind means changing each factory interface and its implementations.",
      "Can be overkill when product families do not vary."
    ],
    "relatedPatterns": "Factory Method (one product creation point), Builder (one complex object).",
    "scenario": "A cloud application selects an AWS factory or Azure factory that creates matching storage and messaging clients.",
    "learningQuestions": [
      "What problem does Abstract Factory solve?",
      "What changes in the design if Abstract Factory is not used?",
      "What is one trade-off of using Abstract Factory?"
    ]
  },
  {
    "id": "builder",
    "name": "Builder",
    "category": "Creational",
    "short": "BLD",
    "summary": "Construct a complex object step by step.",
    "explanation": "Builder improves readability when a constructor would otherwise have many parameters or optional settings.",
    "caution": "Do not add a builder to every tiny object; a constructor or record may be clearer.",
    "useCases": [
      "Immutable DTOs, complex request objects, and configuration objects.",
      "Java APIs such as RestClient.Builder and UriComponentsBuilder use builder-style APIs."
    ],
    "spring": "Java APIs such as RestClient.Builder and UriComponentsBuilder use builder-style APIs.",
    "goal": "Construct a complex object step by step.",
    "code": "class Employee {\n    private final String name;\n    private final int age;\n\n    private Employee(Builder b) {\n        this.name = b.name;\n        this.age = b.age;\n    }\n\n    static class Builder {\n        private final String name;\n        private int age;\n        Builder(String name) { this.name = name; }\n        Builder age(int age) { this.age = age; return this; }\n        Employee build() { return new Employee(this); }\n    }\n}\n\nEmployee e = new Employee.Builder(\"Prem\").age(40).build();",
    "exampleTitle": "Builder.java",
    "interview": "Builder separates the construction process from the final representation and helps avoid telescoping constructors.",
    "intent": "Separate complex object construction from its final representation.",
    "problem": "Constructors with many optional parameters are difficult to read and easy to misuse.",
    "structure": [
      "Builder collects configuration through named methods.",
      "Each method returns the builder for chaining.",
      "build() validates and creates the final object."
    ],
    "tradeoffs": [
      "Improves readability and can support immutable objects.",
      "Requires additional code and types.",
      "Validation should occur at build time or in the final constructor."
    ],
    "relatedPatterns": "Factory Method (chooses a type), Prototype (copies an existing object).",
    "scenario": "Build a report request with optional date range, sort order, pagination, and export format.",
    "learningQuestions": [
      "What problem does Builder solve?",
      "What changes in the design if Builder is not used?",
      "What is one trade-off of using Builder?"
    ]
  },
  {
    "id": "prototype",
    "name": "Prototype",
    "category": "Creational",
    "short": "PRO",
    "summary": "Create new objects by copying an existing prototype.",
    "explanation": "A prototype provides a template for creating similar objects, potentially avoiding expensive initialization.",
    "caution": "Copying objects with nested mutable fields requires a deliberate shallow-versus-deep-copy strategy.",
    "useCases": [
      "Duplicating configured templates, document layouts, or preconfigured objects.",
      "Prototype-style cloning may be implemented with copy constructors or explicit copy methods; Java Cloneable is often avoided in modern code."
    ],
    "spring": "Prototype-style cloning may be implemented with copy constructors or explicit copy methods; Java Cloneable is often avoided in modern code.",
    "goal": "Create new objects by copying an existing prototype.",
    "code": "class ReportConfig {\n    private final String title;\n    private final int pageSize;\n\n    ReportConfig(String title, int pageSize) {\n        this.title = title;\n        this.pageSize = pageSize;\n    }\n\n    ReportConfig copyWithTitle(String newTitle) {\n        return new ReportConfig(newTitle, pageSize);\n    }\n}\n\nReportConfig original = new ReportConfig(\"Monthly\", 20);\nReportConfig copy = original.copyWithTitle(\"Quarterly\");",
    "exampleTitle": "Prototype.java",
    "interview": "A copy constructor or explicit copy method is often safer and clearer than implementing Object.clone().",
    "intent": "Create an object by copying a configured prototype.",
    "problem": "Building a new object from scratch can be repetitive or expensive when many objects share most settings.",
    "structure": [
      "Prototype exposes a copy operation or copy constructor.",
      "Client starts with a configured prototype and creates variants.",
      "Copy semantics define which state is shared and which is duplicated."
    ],
    "tradeoffs": [
      "Can avoid repeated initialization.",
      "Deep copying nested mutable state is tricky.",
      "Explicit copy constructors are often clearer than Object.clone()."
    ],
    "relatedPatterns": "Builder (constructs step by step), Factory Method (creates by choosing implementation).",
    "scenario": "Create several report configurations from a template while changing only the title and date range.",
    "learningQuestions": [
      "What problem does Prototype solve?",
      "What changes in the design if Prototype is not used?",
      "What is one trade-off of using Prototype?"
    ]
  },
  {
    "id": "adapter",
    "name": "Adapter",
    "category": "Structural",
    "short": "AD",
    "summary": "Make an existing interface compatible with the interface a client expects.",
    "explanation": "An adapter translates calls from the application's target interface into calls understood by a legacy or third-party API.",
    "caution": "Prefer a small adapter focused on translation; do not let it become a second business-service layer.",
    "useCases": [
      "Integrating a legacy payment SDK or normalizing third-party APIs.",
      "Spring MVC HandlerAdapter is an example of an adapter role in a framework."
    ],
    "spring": "Spring MVC HandlerAdapter is an example of an adapter role in a framework.",
    "goal": "Make an existing interface compatible with the interface a client expects.",
    "code": "interface PaymentGateway { void pay(double amount); }\n\nclass LegacyPay {\n    void makePayment(double value) {\n        System.out.println(\"Legacy payment: \" + value);\n    }\n}\n\nclass LegacyPayAdapter implements PaymentGateway {\n    private final LegacyPay legacy = new LegacyPay();\n    public void pay(double amount) {\n        legacy.makePayment(amount);\n    }\n}",
    "exampleTitle": "Adapter.java",
    "interview": "Adapter changes the interface; Decorator keeps the interface but adds behavior.",
    "intent": "Translate one interface into another interface expected by the client.",
    "problem": "A useful legacy or third-party component cannot be used directly because its API does not match the application's contract.",
    "structure": [
      "Target is the interface the client expects.",
      "Adaptee is the existing incompatible component.",
      "Adapter implements Target and delegates to Adaptee."
    ],
    "tradeoffs": [
      "Keeps integration-specific translation out of business logic.",
      "Can conceal awkward source API details; preserve errors and semantics carefully.",
      "Prefer composition over modifying third-party code."
    ],
    "relatedPatterns": "Facade (simplifies a subsystem), Decorator (adds behavior while keeping the interface).",
    "scenario": "Wrap a vendor payment SDK so the rest of the application depends on a stable PaymentGateway interface.",
    "learningQuestions": [
      "What problem does Adapter solve?",
      "What changes in the design if Adapter is not used?",
      "What is one trade-off of using Adapter?"
    ]
  },
  {
    "id": "bridge",
    "name": "Bridge",
    "category": "Structural",
    "short": "BR",
    "summary": "Separate an abstraction from its implementation so both can vary independently.",
    "explanation": "Instead of hard-coding every combination into a subclass hierarchy, hold a reference to an implementation interface.",
    "caution": "It can add indirection, so use it when two dimensions genuinely need independent variation.",
    "useCases": [
      "Multiple notification types across multiple delivery channels.",
      "A service abstraction delegating to a pluggable implementation can have a bridge-like structure."
    ],
    "spring": "A service abstraction delegating to a pluggable implementation can have a bridge-like structure.",
    "goal": "Separate an abstraction from its implementation so both can vary independently.",
    "code": "interface Sender { void send(String message); }\nclass EmailSender implements Sender {\n    public void send(String m) { System.out.println(\"Email: \" + m); }\n}\nabstract class Alert {\n    protected final Sender sender;\n    Alert(Sender sender) { this.sender = sender; }\n    abstract void notifyUser(String message);\n}\nclass UrgentAlert extends Alert {\n    UrgentAlert(Sender s) { super(s); }\n    void notifyUser(String m) { sender.send(\"URGENT: \" + m); }\n}",
    "exampleTitle": "Bridge.java",
    "interview": "Bridge separates two independent dimensions of change; Adapter reconciles an interface mismatch.",
    "intent": "Decouple an abstraction from its implementation so both can change independently.",
    "problem": "A class hierarchy explodes when two dimensions vary, such as alert type and delivery channel.",
    "structure": [
      "Abstraction contains a reference to an implementor interface.",
      "Concrete abstractions refine high-level behavior.",
      "Concrete implementors provide low-level operations."
    ],
    "tradeoffs": [
      "Avoids multiplying subclasses for every combination.",
      "Adds indirection and may be unnecessary when only one dimension varies.",
      "Design the two dimensions around genuinely independent change."
    ],
    "relatedPatterns": "Adapter (reconciles existing interfaces), Strategy (swaps an algorithm).",
    "scenario": "Urgent and routine alerts can each use email, SMS, or push delivery without creating a class for every combination.",
    "learningQuestions": [
      "What problem does Bridge solve?",
      "What changes in the design if Bridge is not used?",
      "What is one trade-off of using Bridge?"
    ]
  },
  {
    "id": "composite",
    "name": "Composite",
    "category": "Structural",
    "short": "COM",
    "summary": "Treat individual objects and groups of objects uniformly.",
    "explanation": "A common component interface lets clients operate on a leaf or a tree of components in the same way.",
    "caution": "Consider how unsupported operations and child management should behave in the component contract.",
    "useCases": [
      "File-system trees, organization charts, and nested UI components.",
      "UI component trees are a common real-world composite structure."
    ],
    "spring": "UI component trees are a common real-world composite structure.",
    "goal": "Treat individual objects and groups of objects uniformly.",
    "code": "interface Node { void print(); }\nclass FileNode implements Node {\n    private final String name;\n    FileNode(String name) { this.name = name; }\n    public void print() { System.out.println(name); }\n}\nclass Folder implements Node {\n    private final List<Node> children = new ArrayList<>();\n    void add(Node node) { children.add(node); }\n    public void print() { children.forEach(Node::print); }\n}",
    "exampleTitle": "Composite.java",
    "interview": "Composite lets clients use the same abstraction for a leaf and a container.",
    "intent": "Treat a single object and a group of objects uniformly.",
    "problem": "Client code otherwise needs separate logic for leaves and containers in a tree.",
    "structure": [
      "Component defines common operations.",
      "Leaf represents an individual item.",
      "Composite stores child components and delegates operations to them."
    ],
    "tradeoffs": [
      "Makes recursive tree structures easy to traverse.",
      "The common interface may be too broad for some operations.",
      "Define child-management and unsupported-operation behavior deliberately."
    ],
    "relatedPatterns": "Decorator (wraps one component), Iterator (traverses a structure).",
    "scenario": "A folder contains files and nested folders; asking a folder to print its contents recursively visits all children.",
    "learningQuestions": [
      "What problem does Composite solve?",
      "What changes in the design if Composite is not used?",
      "What is one trade-off of using Composite?"
    ]
  },
  {
    "id": "decorator",
    "name": "Decorator",
    "category": "Structural",
    "short": "DEC",
    "summary": "Add responsibilities to an object dynamically by wrapping it.",
    "explanation": "A decorator implements the same interface as the wrapped object and delegates while adding behavior.",
    "caution": "Too many nested wrappers can make debugging harder; document composition order.",
    "useCases": [
      "Adding compression, buffering, metrics, or authorization around a component.",
      "Java I/O streams, such as BufferedInputStream wrapping FileInputStream, are classic examples."
    ],
    "spring": "Java I/O streams, such as BufferedInputStream wrapping FileInputStream, are classic examples.",
    "goal": "Add responsibilities to an object dynamically by wrapping it.",
    "code": "interface MessageSender { void send(String text); }\nclass BasicSender implements MessageSender {\n    public void send(String text) { System.out.println(text); }\n}\nclass LoggingSender implements MessageSender {\n    private final MessageSender next;\n    LoggingSender(MessageSender next) { this.next = next; }\n    public void send(String text) {\n        System.out.println(\"Logging send\");\n        next.send(text);\n    }\n}\n\nMessageSender sender = new LoggingSender(new BasicSender());",
    "exampleTitle": "Decorator.java",
    "interview": "Decorator preserves the component interface and composes behavior through wrapping.",
    "intent": "Attach additional behavior to an object dynamically without changing its public interface.",
    "problem": "Subclassing for every combination of optional features causes a large class hierarchy.",
    "structure": [
      "Component defines the shared interface.",
      "Concrete component provides base behavior.",
      "Decorator implements Component and wraps another Component."
    ],
    "tradeoffs": [
      "Features compose flexibly at runtime.",
      "Many wrappers can make execution order harder to trace.",
      "Keep decorators focused on one responsibility."
    ],
    "relatedPatterns": "Proxy (controls access), Adapter (changes interface), Composite (combines children).",
    "scenario": "Wrap a sender with logging, metrics, retry, or compression decorators without changing the sender implementation.",
    "learningQuestions": [
      "What problem does Decorator solve?",
      "What changes in the design if Decorator is not used?",
      "What is one trade-off of using Decorator?"
    ]
  },
  {
    "id": "facade",
    "name": "Facade",
    "category": "Structural",
    "short": "FAC",
    "summary": "Provide a simpler interface over a complex subsystem.",
    "explanation": "A facade offers a focused entry point and hides subsystem coordination from the caller.",
    "caution": "Do not turn the facade into a giant class that owns every business rule.",
    "useCases": [
      "Simplifying a workflow that calls inventory, payment, and shipping services.",
      "A Spring application service can provide a facade over multiple collaborators, when the boundary is intentional."
    ],
    "spring": "A Spring application service can provide a facade over multiple collaborators, when the boundary is intentional.",
    "goal": "Provide a simpler interface over a complex subsystem.",
    "code": "class Inventory { void reserve() { System.out.println(\"Reserved\"); } }\nclass Payment { void charge() { System.out.println(\"Charged\"); } }\nclass Shipping { void ship() { System.out.println(\"Shipped\"); } }\n\nclass OrderFacade {\n    private final Inventory inventory = new Inventory();\n    private final Payment payment = new Payment();\n    private final Shipping shipping = new Shipping();\n    void placeOrder() {\n        inventory.reserve();\n        payment.charge();\n        shipping.ship();\n    }\n}",
    "exampleTitle": "Facade.java",
    "interview": "Facade simplifies subsystem use; it does not necessarily replace the subsystem's public APIs.",
    "intent": "Offer a simple entry point to a more complex subsystem.",
    "problem": "Clients need to know the order and coordination of many subsystem calls.",
    "structure": [
      "Facade exposes a smaller high-level API.",
      "Subsystem classes keep their specialized responsibilities.",
      "Facade delegates and coordinates calls."
    ],
    "tradeoffs": [
      "Reduces coupling for common workflows.",
      "A facade should not become a giant class containing unrelated business logic.",
      "Clients can still use subsystem APIs directly when needed."
    ],
    "relatedPatterns": "Adapter (interface translation), Mediator (coordinates peer objects).",
    "scenario": "An order facade coordinates inventory reservation, payment, and shipping setup behind placeOrder().",
    "learningQuestions": [
      "What problem does Facade solve?",
      "What changes in the design if Facade is not used?",
      "What is one trade-off of using Facade?"
    ]
  },
  {
    "id": "flyweight",
    "name": "Flyweight",
    "category": "Structural",
    "short": "FLY",
    "summary": "Share common intrinsic state across many fine-grained objects.",
    "explanation": "Store reusable, shared state once and pass varying external state into operations.",
    "caution": "Shared state must be immutable or safely managed to avoid concurrency bugs.",
    "useCases": [
      "Large numbers of similar icons, glyphs, map markers, or game objects.",
      "String interning is related to object sharing, though not a direct general-purpose GoF flyweight implementation."
    ],
    "spring": "String interning is related to object sharing, though not a direct general-purpose GoF flyweight implementation.",
    "goal": "Share common intrinsic state across many fine-grained objects.",
    "code": "class TreeType {\n    final String name;\n    final String color;\n    TreeType(String name, String color) {\n        this.name = name; this.color = color;\n    }\n}\nclass Tree {\n    final int x, y;       // external state\n    final TreeType type;  // shared state\n    Tree(int x, int y, TreeType type) {\n        this.x = x; this.y = y; this.type = type;\n    }\n}",
    "exampleTitle": "Flyweight.java",
    "interview": "Flyweight saves memory by sharing intrinsic state while keeping extrinsic state outside.",
    "intent": "Share reusable intrinsic state among many fine-grained objects.",
    "problem": "Creating a large number of similar objects duplicates the same data and consumes memory.",
    "structure": [
      "Flyweight stores shared intrinsic state.",
      "Context stores extrinsic state unique to each use.",
      "Factory reuses flyweights with matching intrinsic state."
    ],
    "tradeoffs": [
      "Can greatly reduce memory use at scale.",
      "Separating intrinsic and extrinsic state adds complexity.",
      "Shared state should usually be immutable or thread-safe."
    ],
    "relatedPatterns": "Singleton (one instance), Object Pool (reuses instances but serves a different purpose).",
    "scenario": "Thousands of trees in a game share a TreeType containing species and texture while each tree stores its own coordinates.",
    "learningQuestions": [
      "What problem does Flyweight solve?",
      "What changes in the design if Flyweight is not used?",
      "What is one trade-off of using Flyweight?"
    ]
  },
  {
    "id": "proxy",
    "name": "Proxy",
    "category": "Structural",
    "short": "PRX",
    "summary": "Control access to another object through a stand-in with the same interface.",
    "explanation": "A proxy can add access checks, lazy initialization, remote calls, or caching while preserving the client-facing contract.",
    "caution": "Proxy logic can hide latency or side effects; make those behaviors observable.",
    "useCases": [
      "Lazy loading, access control, remote service clients, and method interception.",
      "Spring AOP and @Transactional commonly use proxies to intercept method calls."
    ],
    "spring": "Spring AOP and @Transactional commonly use proxies to intercept method calls.",
    "goal": "Control access to another object through a stand-in with the same interface.",
    "code": "interface Document { void display(); }\nclass RealDocument implements Document {\n    public void display() { System.out.println(\"Displaying document\"); }\n}\nclass ProtectedDocument implements Document {\n    private final Document target = new RealDocument();\n    private final boolean allowed;\n    ProtectedDocument(boolean allowed) { this.allowed = allowed; }\n    public void display() {\n        if (!allowed) throw new SecurityException(\"Access denied\");\n        target.display();\n    }\n}",
    "exampleTitle": "Proxy.java",
    "interview": "Spring proxy-based behavior may not apply to self-invocation because the call bypasses the proxy.",
    "intent": "Stand in for another object to control access or add behavior.",
    "problem": "Access checks, lazy initialization, caching, or remote-call details would otherwise leak into clients.",
    "structure": [
      "Subject defines the common interface.",
      "Real subject performs the core work.",
      "Proxy implements Subject and controls delegation to the real subject."
    ],
    "tradeoffs": [
      "Centralizes cross-cutting access behavior.",
      "Can hide latency or side effects if not observable.",
      "Framework proxies have constraints, such as self-invocation bypassing Spring proxy interception."
    ],
    "relatedPatterns": "Decorator (adds responsibilities), Adapter (changes interface).",
    "scenario": "A proxy checks authorization before delegating to a document service or lazily loads a large resource.",
    "learningQuestions": [
      "What problem does Proxy solve?",
      "What changes in the design if Proxy is not used?",
      "What is one trade-off of using Proxy?"
    ]
  },
  {
    "id": "chain",
    "name": "Chain of Responsibility",
    "category": "Behavioral",
    "short": "COR",
    "summary": "Pass a request along a sequence of handlers until one handles it or the chain ends.",
    "explanation": "Each handler decides whether to process the request, reject it, or delegate to the next handler.",
    "caution": "Ensure the chain has clear termination behavior and predictable ordering.",
    "useCases": [
      "Servlet filters, validation pipelines, and request-processing middleware.",
      "The Spring Security filter chain and servlet filters are common examples."
    ],
    "spring": "The Spring Security filter chain and servlet filters are common examples.",
    "goal": "Pass a request along a sequence of handlers until one handles it or the chain ends.",
    "code": "abstract class Handler {\n    private Handler next;\n    Handler setNext(Handler next) { this.next = next; return next; }\n    void handle(String request) {\n        if (canHandle(request)) process(request);\n        else if (next != null) next.handle(request);\n    }\n    abstract boolean canHandle(String request);\n    abstract void process(String request);\n}",
    "exampleTitle": "ChainOfResponsibility.java",
    "interview": "A request can be handled by one handler or passed along; this differs from a simple sequence where every step always runs.",
    "intent": "Pass a request through possible handlers without hard-coding one handler in the sender.",
    "problem": "A sender otherwise needs a long conditional statement that knows every handler and its order.",
    "structure": [
      "Handler defines processing and delegation.",
      "Concrete handlers decide whether to handle or pass on.",
      "A chain links handlers in the required order."
    ],
    "tradeoffs": [
      "Handlers can be rearranged or added independently.",
      "A request may reach the end unhandled; define fallback behavior.",
      "Debugging depends on understanding handler order."
    ],
    "relatedPatterns": "Decorator (all wrappers usually delegate), Command (encapsulates a request).",
    "scenario": "A web request passes through logging, authentication, authorization, and rate-limit filters.",
    "learningQuestions": [
      "What problem does Chain of Responsibility solve?",
      "What changes in the design if Chain of Responsibility is not used?",
      "What is one trade-off of using Chain of Responsibility?"
    ]
  },
  {
    "id": "command",
    "name": "Command",
    "category": "Behavioral",
    "short": "CMD",
    "summary": "Encapsulate a request as an object.",
    "explanation": "Represent an action as a value, enabling queuing, logging, undo, retries, or delayed execution.",
    "caution": "Undo requires storing enough prior state to reverse an operation safely.",
    "useCases": [
      "Job queues, UI actions, scheduled tasks, and undo/redo operations.",
      "Runnable and many task abstractions have command-like characteristics."
    ],
    "spring": "Runnable and many task abstractions have command-like characteristics.",
    "goal": "Encapsulate a request as an object.",
    "code": "interface Command { void execute(); }\nclass Light {\n    void on() { System.out.println(\"Light on\"); }\n}\nclass TurnOnCommand implements Command {\n    private final Light light;\n    TurnOnCommand(Light light) { this.light = light; }\n    public void execute() { light.on(); }\n}\nclass Button {\n    private final Command command;\n    Button(Command command) { this.command = command; }\n    void click() { command.execute(); }\n}",
    "exampleTitle": "Command.java",
    "interview": "Command turns an operation into an object that can be passed around and executed later.",
    "intent": "Represent a request or operation as an object.",
    "problem": "The invoker should trigger an action without knowing the receiver or how the action works.",
    "structure": [
      "Command declares execute().",
      "Concrete command stores the receiver and parameters.",
      "Invoker triggers the command; receiver performs the work."
    ],
    "tradeoffs": [
      "Supports queues, scheduling, auditing, and undo when state is captured.",
      "Creates more small classes or objects.",
      "Undo and retries require careful state and idempotency design."
    ],
    "relatedPatterns": "Strategy (selects an algorithm), Memento (stores state for restoration).",
    "scenario": "A job scheduler stores command objects and executes them later, independently of the component that submitted them.",
    "learningQuestions": [
      "What problem does Command solve?",
      "What changes in the design if Command is not used?",
      "What is one trade-off of using Command?"
    ]
  },
  {
    "id": "interpreter",
    "name": "Interpreter",
    "category": "Behavioral",
    "short": "INT",
    "summary": "Represent a small grammar and provide a way to evaluate expressions in that grammar.",
    "explanation": "Each expression type knows how to interpret itself within a defined language.",
    "caution": "A hand-written interpreter is not a good choice for a large or complex language; use a parser framework instead.",
    "useCases": [
      "Simple rule engines, filters, or small expression languages.",
      "Spring Expression Language (SpEL) is a language with an expression parser, not itself simply the GoF pattern."
    ],
    "spring": "Spring Expression Language (SpEL) is a language with an expression parser, not itself simply the GoF pattern.",
    "goal": "Represent a small grammar and provide a way to evaluate expressions in that grammar.",
    "code": "interface Expression { boolean interpret(String input); }\nclass ContainsExpression implements Expression {\n    private final String expected;\n    ContainsExpression(String expected) { this.expected = expected; }\n    public boolean interpret(String input) {\n        return input != null && input.contains(expected);\n    }\n}\nExpression rule = new ContainsExpression(\"java\");\nboolean matches = rule.interpret(\"learn java patterns\");",
    "exampleTitle": "Interpreter.java",
    "interview": "The pattern fits small, stable grammars; complex grammars generally call for parser tooling.",
    "intent": "Represent a small language grammar as objects that can evaluate expressions.",
    "problem": "A small domain-specific language needs composable rules instead of a growing set of string conditionals.",
    "structure": [
      "Expression defines an interpretation operation.",
      "Terminal expressions handle simple tokens.",
      "Composite expressions combine smaller expressions."
    ],
    "tradeoffs": [
      "Works for small, stable grammars.",
      "Large grammars become verbose and slow; use a parser generator or dedicated parser.",
      "Input validation and security are essential when evaluating user-defined expressions."
    ],
    "relatedPatterns": "Visitor (operations over object structures), Composite (recursive object trees).",
    "scenario": "Evaluate simple rules such as 'name contains java' or combine predicates with AND/OR.",
    "learningQuestions": [
      "What problem does Interpreter solve?",
      "What changes in the design if Interpreter is not used?",
      "What is one trade-off of using Interpreter?"
    ]
  },
  {
    "id": "iterator",
    "name": "Iterator",
    "category": "Behavioral",
    "short": "ITR",
    "summary": "Traverse a collection without exposing its internal representation.",
    "explanation": "The iterator provides a standard way to visit elements one by one while hiding how the collection stores them.",
    "caution": "Java's standard collection APIs already provide iterators; custom ones are mainly useful for specialized traversal.",
    "useCases": [
      "Traversing trees, paginated results, or custom data structures.",
      "java.util.Iterator is the direct standard-library abstraction."
    ],
    "spring": "java.util.Iterator is the direct standard-library abstraction.",
    "goal": "Traverse a collection without exposing its internal representation.",
    "code": "class NumberRange implements Iterable<Integer> {\n    private final int start, end;\n    NumberRange(int start, int end) { this.start = start; this.end = end; }\n    public Iterator<Integer> iterator() {\n        return new Iterator<>() {\n            int current = start;\n            public boolean hasNext() { return current <= end; }\n            public Integer next() {\n                if (!hasNext()) throw new NoSuchElementException();\n                return current++;\n            }\n        };\n    }\n}",
    "exampleTitle": "Iterator.java",
    "interview": "Iterator separates traversal logic from the collection's internal data structure.",
    "intent": "Provide sequential access to elements without exposing a collection's internal representation.",
    "problem": "Callers should not need to know whether a collection uses an array, tree, or generated sequence.",
    "structure": [
      "Iterator exposes hasNext() and next().",
      "Aggregate provides an iterator.",
      "The iterator stores traversal state."
    ],
    "tradeoffs": [
      "Separates traversal from storage.",
      "Custom iterators must define exhaustion and mutation behavior.",
      "Use Java's existing Iterable and Iterator APIs when possible."
    ],
    "relatedPatterns": "Composite (tree structures), Visitor (operations across elements).",
    "scenario": "Iterate over a custom range, tree, or paginated data source using a familiar for-each loop.",
    "learningQuestions": [
      "What problem does Iterator solve?",
      "What changes in the design if Iterator is not used?",
      "What is one trade-off of using Iterator?"
    ]
  },
  {
    "id": "mediator",
    "name": "Mediator",
    "category": "Behavioral",
    "short": "MED",
    "summary": "Centralize complex communication among collaborating objects.",
    "explanation": "Colleagues communicate through a mediator rather than having many direct dependencies on one another.",
    "caution": "The mediator itself can become a god object; keep its responsibilities cohesive.",
    "useCases": [
      "UI components, workflow coordination, and chat-room participant communication.",
      "Application services sometimes coordinate collaborators, but not every service class is a mediator pattern."
    ],
    "spring": "Application services sometimes coordinate collaborators, but not every service class is a mediator pattern.",
    "goal": "Centralize complex communication among collaborating objects.",
    "code": "interface Mediator { void send(String message, User sender); }\nclass User {\n    private final String name;\n    private final Mediator mediator;\n    User(String name, Mediator mediator) {\n        this.name = name; this.mediator = mediator;\n    }\n    void send(String message) { mediator.send(message, this); }\n    String name() { return name; }\n}",
    "exampleTitle": "Mediator.java",
    "interview": "Mediator reduces many-to-many dependencies by moving coordination into a central collaborator.",
    "intent": "Centralize interaction logic among a group of collaborating objects.",
    "problem": "Many direct references between colleagues create a tightly coupled web of dependencies.",
    "structure": [
      "Mediator defines communication operations.",
      "Colleagues notify the mediator instead of coordinating directly.",
      "Concrete mediator decides which colleagues should react."
    ],
    "tradeoffs": [
      "Reduces peer-to-peer coupling.",
      "Mediator can become a god object if too much behavior accumulates.",
      "Keep coordination cohesive and split mediators by workflow when appropriate."
    ],
    "relatedPatterns": "Facade (simplifies subsystem access), Observer (notifies subscribers).",
    "scenario": "A chat room mediates messages among users, so each user does not need direct references to every other user.",
    "learningQuestions": [
      "What problem does Mediator solve?",
      "What changes in the design if Mediator is not used?",
      "What is one trade-off of using Mediator?"
    ]
  },
  {
    "id": "memento",
    "name": "Memento",
    "category": "Behavioral",
    "short": "MEM",
    "summary": "Capture and restore an object's state without exposing its internals.",
    "explanation": "A snapshot object stores state so it can be restored later, often for undo or checkpoints.",
    "caution": "Snapshots can consume memory; be deliberate about what state is captured and how long it is retained.",
    "useCases": [
      "Undo history, editors, workflow checkpoints, and game save states.",
      "Undo stacks in editors are a common example; there is no single required Spring equivalent."
    ],
    "spring": "Undo stacks in editors are a common example; there is no single required Spring equivalent.",
    "goal": "Capture and restore an object's state without exposing its internals.",
    "code": "record EditorState(String text, int cursor) {}\nclass Editor {\n    private String text = \"\";\n    private int cursor;\n    EditorState save() { return new EditorState(text, cursor); }\n    void restore(EditorState state) {\n        text = state.text();\n        cursor = state.cursor();\n    }\n}",
    "exampleTitle": "Memento.java",
    "interview": "Memento preserves encapsulation by letting the originator control state snapshots.",
    "intent": "Capture and restore an object's state without exposing its internal representation.",
    "problem": "Undo and rollback features need snapshots but should not expose private fields to external code.",
    "structure": [
      "Originator creates and restores snapshots.",
      "Memento stores the captured state.",
      "Caretaker stores snapshots without inspecting their internals."
    ],
    "tradeoffs": [
      "Supports undo, checkpoints, and restoration.",
      "Snapshots can consume significant memory.",
      "Decide whether snapshots are deep copies and how long they remain valid."
    ],
    "relatedPatterns": "Command (stores operations), Prototype (copies objects).",
    "scenario": "A text editor saves document text and cursor position before an edit so the previous state can be restored.",
    "learningQuestions": [
      "What problem does Memento solve?",
      "What changes in the design if Memento is not used?",
      "What is one trade-off of using Memento?"
    ]
  },
  {
    "id": "observer",
    "name": "Observer",
    "category": "Behavioral",
    "short": "OBS",
    "summary": "Notify subscribers when an object's state or an event changes.",
    "explanation": "A publisher maintains subscribers and notifies them when an event occurs, reducing direct coupling between producer and consumers.",
    "caution": "Handle subscriber lifecycle, exceptions, and asynchronous delivery when needed.",
    "useCases": [
      "Domain events, UI listeners, notifications, and event-driven integrations.",
      "Spring application events are an in-process observer-style mechanism; Kafka is distributed pub/sub messaging."
    ],
    "spring": "Spring application events are an in-process observer-style mechanism; Kafka is distributed pub/sub messaging.",
    "goal": "Notify subscribers when an object's state or an event changes.",
    "code": "interface Observer { void update(String event); }\nclass Publisher {\n    private final List<Observer> observers = new ArrayList<>();\n    void subscribe(Observer o) { observers.add(o); }\n    void publish(String event) {\n        observers.forEach(o -> o.update(event));\n    }\n}",
    "exampleTitle": "Observer.java",
    "interview": "In-process observer callbacks and durable distributed messaging have different delivery guarantees.",
    "intent": "Notify multiple interested subscribers when an event or state change occurs.",
    "problem": "A producer should not need hard-coded knowledge of every consumer that reacts to its events.",
    "structure": [
      "Subject or publisher manages subscribers.",
      "Observer defines a notification contract.",
      "Concrete observers react to published events."
    ],
    "tradeoffs": [
      "Reduces direct coupling and makes subscribers extensible.",
      "Manage subscription lifecycle, ordering, and exception behavior.",
      "In-process callbacks do not provide durable delivery like a message broker."
    ],
    "relatedPatterns": "Mediator (centralized coordination), Chain of Responsibility (request passes between handlers).",
    "scenario": "When an order is placed, independent listeners can update analytics, send notifications, or trigger fulfillment.",
    "learningQuestions": [
      "What problem does Observer solve?",
      "What changes in the design if Observer is not used?",
      "What is one trade-off of using Observer?"
    ]
  },
  {
    "id": "state",
    "name": "State",
    "category": "Behavioral",
    "short": "STA",
    "summary": "Change an object's behavior when its internal state changes.",
    "explanation": "Move state-specific behavior into state objects instead of maintaining many conditionals throughout a class.",
    "caution": "For a tiny state machine, an enum and switch may be simpler.",
    "useCases": [
      "Order lifecycle, document workflow, connection states, and media players.",
      "Workflow and order-state implementations often use state-machine concepts; Spring Statemachine is a dedicated option."
    ],
    "spring": "Workflow and order-state implementations often use state-machine concepts; Spring Statemachine is a dedicated option.",
    "goal": "Change an object's behavior when its internal state changes.",
    "code": "interface OrderState { void next(Order order); }\nclass Created implements OrderState {\n    public void next(Order order) { order.setState(new Paid()); }\n}\nclass Paid implements OrderState {\n    public void next(Order order) { order.setState(new Shipped()); }\n}\nclass Order {\n    private OrderState state = new Created();\n    void setState(OrderState state) { this.state = state; }\n    void next() { state.next(this); }\n}",
    "exampleTitle": "State.java",
    "interview": "State changes behavior based on current state; Strategy selects an algorithm for a particular task.",
    "intent": "Move state-dependent behavior into dedicated state objects.",
    "problem": "A large set of if/else or switch statements grows as an object's lifecycle gains states and transitions.",
    "structure": [
      "Context holds the current state.",
      "State interface defines state-specific operations.",
      "Concrete states implement behavior and transitions."
    ],
    "tradeoffs": [
      "Makes state-specific rules explicit and localized.",
      "Adds classes and can be excessive for a tiny state machine.",
      "Validate legal transitions and consider persistence of state."
    ],
    "relatedPatterns": "Strategy (swappable algorithm), Observer (broadcasts state changes).",
    "scenario": "An order moves through Created, Paid, Shipped, and Delivered states, each allowing different operations.",
    "learningQuestions": [
      "What problem does State solve?",
      "What changes in the design if State is not used?",
      "What is one trade-off of using State?"
    ]
  },
  {
    "id": "strategy",
    "name": "Strategy",
    "category": "Behavioral",
    "short": "STR",
    "summary": "Define a family of interchangeable algorithms and make them selectable.",
    "explanation": "Put each algorithm behind a common interface and inject the desired implementation into the context.",
    "caution": "Avoid creating many strategies when a simple conditional is stable and easy to understand.",
    "useCases": [
      "Payment methods, discount policies, sorting choices, and validation algorithms.",
      "Spring dependency injection makes strategy implementations easy to inject or select."
    ],
    "spring": "Spring dependency injection makes strategy implementations easy to inject or select.",
    "goal": "Define a family of interchangeable algorithms and make them selectable.",
    "code": "interface PaymentStrategy { void pay(double amount); }\nclass UpiPayment implements PaymentStrategy {\n    public void pay(double amount) {\n        System.out.println(\"UPI payment: \" + amount);\n    }\n}\nclass CheckoutService {\n    private final PaymentStrategy strategy;\n    CheckoutService(PaymentStrategy strategy) { this.strategy = strategy; }\n    void checkout(double amount) { strategy.pay(amount); }\n}\n\nCheckoutService checkout = new CheckoutService(new UpiPayment());\ncheckout.checkout(500);",
    "exampleTitle": "Strategy.java",
    "interview": "Prefer composition and dependency injection over a large if/else chain when behavior varies independently.",
    "intent": "Encapsulate interchangeable algorithms behind a common interface.",
    "problem": "A large conditional block selects behavior and makes adding algorithms require modifying existing code.",
    "structure": [
      "Strategy declares the algorithm contract.",
      "Concrete strategies implement variants.",
      "Context receives and invokes the selected strategy."
    ],
    "tradeoffs": [
      "Supports composition, testing, and extension without changing the context.",
      "Too many tiny strategies can add unnecessary indirection.",
      "Select strategies explicitly or through dependency injection/configuration."
    ],
    "relatedPatterns": "State (behavior depends on lifecycle state), Factory (can choose which strategy to create).",
    "scenario": "Checkout selects UPI, card, or wallet payment through a PaymentStrategy interface.",
    "learningQuestions": [
      "What problem does Strategy solve?",
      "What changes in the design if Strategy is not used?",
      "What is one trade-off of using Strategy?"
    ]
  },
  {
    "id": "template-method",
    "name": "Template Method",
    "category": "Behavioral",
    "short": "TM",
    "summary": "Define an algorithm skeleton in a base class while letting subclasses customize selected steps.",
    "explanation": "The invariant sequence remains in the base class; subclasses override the hooks or primitive operations.",
    "caution": "Inheritance can make changes harder when many steps need independent variation; consider composition when appropriate.",
    "useCases": [
      "Data import pipelines, report generation, and standardized processing workflows.",
      "JdbcTemplate uses a template/callback approach inspired by the broader template-method idea, though its callback mechanism is not a textbook inheritance-only implementation."
    ],
    "spring": "JdbcTemplate uses a template/callback approach inspired by the broader template-method idea, though its callback mechanism is not a textbook inheritance-only implementation.",
    "goal": "Define an algorithm skeleton in a base class while letting subclasses customize selected steps.",
    "code": "abstract class DataImporter {\n    public final void importData() {\n        read();\n        validate();\n        save();\n    }\n    protected abstract void read();\n    protected void validate() { System.out.println(\"Validated\"); }\n    protected abstract void save();\n}\nclass CsvImporter extends DataImporter {\n    protected void read() { System.out.println(\"Read CSV\"); }\n    protected void save() { System.out.println(\"Save rows\"); }\n}",
    "exampleTitle": "TemplateMethod.java",
    "interview": "The base class controls the algorithm's order while subclasses customize defined steps.",
    "intent": "Define the fixed skeleton of an algorithm while allowing subclasses to customize selected steps.",
    "problem": "Several workflows share the same sequence but differ in a few operations.",
    "structure": [
      "Base class defines the template method and step order.",
      "Concrete subclasses override designated steps.",
      "The template method can be final to protect the sequence."
    ],
    "tradeoffs": [
      "Prevents duplication of invariant workflow steps.",
      "Inheritance couples subclasses to the base class.",
      "Composition and callbacks may be better when variation is extensive."
    ],
    "relatedPatterns": "Strategy (composition-based algorithm selection), Factory Method (often appears as a hook in template methods).",
    "scenario": "Different importers all read, validate, and save data, but each importer implements its own reading and saving steps.",
    "learningQuestions": [
      "What problem does Template Method solve?",
      "What changes in the design if Template Method is not used?",
      "What is one trade-off of using Template Method?"
    ]
  },
  {
    "id": "visitor",
    "name": "Visitor",
    "category": "Behavioral",
    "short": "VIS",
    "summary": "Add operations to a set of object types without putting every operation into those classes.",
    "explanation": "Each element accepts a visitor, which dispatches the operation based on the element's concrete type.",
    "caution": "Adding new element types can be expensive because visitors may need new methods for each type.",
    "useCases": [
      "Operations over stable object structures, such as AST processing or document export.",
      "Compilers often use visitors to process abstract syntax trees."
    ],
    "spring": "Compilers often use visitors to process abstract syntax trees.",
    "goal": "Add operations to a set of object types without putting every operation into those classes.",
    "code": "interface Shape { void accept(ShapeVisitor visitor); }\nclass Circle implements Shape {\n    final double radius;\n    Circle(double radius) { this.radius = radius; }\n    public void accept(ShapeVisitor v) { v.visit(this); }\n}\ninterface ShapeVisitor { void visit(Circle circle); }\nclass AreaVisitor implements ShapeVisitor {\n    public void visit(Circle c) {\n        System.out.println(Math.PI * c.radius * c.radius);\n    }\n}",
    "exampleTitle": "Visitor.java",
    "interview": "Visitor makes adding operations easier but can make adding new element types harder.",
    "intent": "Add new operations to a stable set of element types without adding those operations to every element class.",
    "problem": "Many operations over a class hierarchy can clutter element classes or require repeated type checks.",
    "structure": [
      "Element exposes accept(visitor).",
      "Visitor declares an operation for each concrete element type.",
      "Concrete visitor implements those operations."
    ],
    "tradeoffs": [
      "Makes new operations easy to add.",
      "Adding a new element type requires updating visitor interfaces and implementations.",
      "Double dispatch is central to the classic pattern."
    ],
    "relatedPatterns": "Iterator (traversal), Interpreter (expression evaluation).",
    "scenario": "A compiler visits syntax-tree nodes to generate code, validate rules, or produce formatted output.",
    "learningQuestions": [
      "What problem does Visitor solve?",
      "What changes in the design if Visitor is not used?",
      "What is one trade-off of using Visitor?"
    ]
  },
  {
    "id": "null-object",
    "name": "Null Object",
    "category": "Other",
    "short": "NUL",
    "summary": "Provide a harmless object implementing the expected interface instead of passing null.",
    "explanation": "A no-op implementation removes repeated null checks at call sites where doing nothing is a valid behavior.",
    "caution": "Do not hide missing required dependencies or errors that should fail loudly.",
    "useCases": [
      "Optional logging, optional notification hooks, and default strategies.",
      "A common object-oriented idiom, but not one of the original 23 GoF patterns."
    ],
    "spring": "A common object-oriented idiom, but not one of the original 23 GoF patterns.",
    "goal": "Provide a harmless object implementing the expected interface instead of passing null.",
    "code": "interface Logger { void log(String message); }\nclass ConsoleLogger implements Logger {\n    public void log(String message) { System.out.println(message); }\n}\nclass NoOpLogger implements Logger {\n    public void log(String message) { /* intentionally empty */ }\n}\n\nLogger logger = new NoOpLogger();\nlogger.log(\"Nothing happens\");",
    "exampleTitle": "NullObject.java",
    "interview": "Null Object is commonly discussed alongside GoF patterns but is not one of the original 23.",
    "intent": "Use a valid no-op implementation when absence of behavior is an expected case.",
    "problem": "Repeated null checks clutter callers when a missing optional collaborator should simply do nothing.",
    "structure": [
      "Interface defines the operation.",
      "Real implementation performs work.",
      "Null implementation safely performs no action."
    ],
    "tradeoffs": [
      "Removes repetitive null checks at call sites.",
      "Can conceal a configuration error if the dependency was actually required.",
      "This is a useful idiom, not one of the original 23 GoF patterns."
    ],
    "relatedPatterns": "Strategy (pluggable behavior), Optional (represents possible absence rather than a behavior object).",
    "scenario": "A NoOpLogger lets optional logging calls remain simple in a small component or test.",
    "learningQuestions": [
      "What problem does Null Object solve?",
      "What changes in the design if Null Object is not used?",
      "What is one trade-off of using Null Object?"
    ]
  },
  {
    "id": "ms-api-gateway",
    "name": "API Gateway",
    "category": "Microservices",
    "short": "GW",
    "summary": "Provide one entry point for clients and route requests to the appropriate backend services.",
    "explanation": "An API Gateway hides internal service topology from clients. It can route requests, authenticate callers, apply rate limits, transform requests, and aggregate responses. Keep business logic in the services rather than turning the gateway into a monolith.",
    "intent": "Give clients a stable, controlled entry point to a system composed of many services.",
    "problem": "Without a gateway, clients must know each service address and may duplicate cross-cutting logic such as authentication, throttling, and routing.",
    "structure": [
      "Client sends a request to the gateway.",
      "Gateway authenticates or applies edge policies as configured.",
      "Gateway routes to one or more backend services.",
      "Gateway returns or aggregates the response."
    ],
    "problem2": "Clients become coupled to internal service URLs and deployment changes.",
    "tradeoffs": [
      "Centralizes routing and edge concerns.",
      "Can become a bottleneck or single point of failure if not deployed redundantly.",
      "Avoid putting domain business workflows and excessive orchestration into the gateway."
    ],
    "relatedPatterns": "Backend for Frontend (a client-specific gateway), Service Discovery (finds service instances), Circuit Breaker (protects remote calls).",
    "scenario": "A React app calls /api/orders; the gateway routes to Order Service and applies authentication before forwarding the request.",
    "useCases": [
      "Public APIs for mobile and web clients.",
      "Routing, authentication, rate limiting, and request aggregation."
    ],
    "goal": "One client-facing entry point for multiple services.",
    "spring": "Spring Cloud Gateway is a common implementation option.",
    "code": "// Illustrative Spring Cloud Gateway route configuration (YAML)\nspring:\n  cloud:\n    gateway:\n      routes:\n        - id: order-service\n          uri: http://order-service:8081\n          predicates:\n            - Path=/api/orders/**\n          filters:\n            - StripPrefix=1",
    "exampleTitle": "application.yml",
    "interview": "Explain which responsibilities belong at the edge (routing, auth policy, rate limiting) and which belong inside domain services.",
    "learningQuestions": [
      "What problem does API Gateway solve?",
      "What failure mode or trade-off should you consider with API Gateway?",
      "How could you implement API Gateway in a Spring Boot system?"
    ],
    "caution": "Avoid putting domain business workflows and excessive orchestration into the gateway."
  },
  {
    "id": "ms-service-discovery",
    "name": "Service Discovery",
    "category": "Microservices",
    "short": "SD",
    "summary": "Allow services to locate healthy instances dynamically instead of relying on fixed host addresses.",
    "explanation": "In dynamic environments, service instances can be created, removed, or rescheduled. Discovery uses a registry or platform DNS to resolve a logical service name to reachable instances.",
    "intent": "Decouple callers from the changing network locations of service instances.",
    "problem": "Hard-coded IP addresses and ports break as services scale or move between hosts.",
    "structure": [
      "Service instances register themselves or are registered by the platform.",
      "A caller resolves a logical service name.",
      "Discovery or load balancing selects a reachable instance.",
      "Health checks help avoid unhealthy instances."
    ],
    "tradeoffs": [
      "Supports dynamic scaling and failover.",
      "Adds registry or platform dependencies if using a dedicated registry.",
      "Kubernetes DNS often provides discovery without a separate Eureka registry."
    ],
    "relatedPatterns": "Load Balancing, API Gateway, Circuit Breaker.",
    "scenario": "Order Service calls http://payment-service/payments rather than embedding a machine IP address.",
    "useCases": [
      "Autoscaled service instances.",
      "Environments where instance locations change frequently."
    ],
    "goal": "Resolve logical service names to healthy instances.",
    "spring": "Spring Cloud Netflix Eureka is one option; Kubernetes Services and DNS are another.",
    "code": "// Spring WebClient using a logical service name\n@Bean\nWebClient paymentClient(WebClient.Builder builder) {\n    return builder\n        .baseUrl(\"http://payment-service\")\n        .build();\n}\n\n// In Kubernetes, the Service DNS name resolves to its endpoints.",
    "exampleTitle": "PaymentClientConfig.java",
    "interview": "Mention that discovery can be client-side or server-side. Kubernetes Service DNS is frequently enough in Kubernetes deployments.",
    "learningQuestions": [
      "What problem does Service Discovery solve?",
      "What failure mode or trade-off should you consider with Service Discovery?",
      "How could you implement Service Discovery in a Spring Boot system?"
    ],
    "caution": "Kubernetes DNS often provides discovery without a separate Eureka registry."
  },
  {
    "id": "ms-circuit-breaker",
    "name": "Circuit Breaker",
    "category": "Microservices",
    "short": "CB",
    "summary": "Stop repeatedly calling a dependency that is failing, then allow controlled recovery attempts.",
    "explanation": "A circuit breaker typically moves among Closed (calls flow), Open (calls fail fast), and Half-Open (a few trial calls are allowed). It protects callers from wasting resources on a dependency that is unlikely to respond successfully.",
    "intent": "Prevent cascading failures when a remote dependency becomes unhealthy.",
    "problem": "Repeated slow or failed calls can exhaust request threads, connections, and memory across multiple services.",
    "structure": [
      "Closed: record failures and allow calls.",
      "When a threshold is reached, open the circuit.",
      "Open: fail fast or use a fallback.",
      "After a wait period, Half-Open allows limited trial calls."
    ],
    "tradeoffs": [
      "Improves resilience and limits resource waste.",
      "Thresholds that are too sensitive can interrupt healthy traffic.",
      "Fallbacks must be meaningful; do not silently fabricate success."
    ],
    "relatedPatterns": "Retry, Timeout, Bulkhead, Fallback.",
    "scenario": "Order Service temporarily stops calling an unhealthy Shipping Service and returns an order status that can be checked later.",
    "useCases": [
      "Remote HTTP calls.",
      "Database or third-party API dependencies with transient outages."
    ],
    "goal": "Fail fast and limit cascading failures.",
    "spring": "Resilience4j integrates with Spring Boot and supports circuit breakers, retries, rate limiters, and bulkheads.",
    "code": "// Resilience4j annotation example\n@CircuitBreaker(name = \"shippingService\", fallbackMethod = \"shippingFallback\")\npublic ShippingStatus getShippingStatus(String orderId) {\n    return shippingClient.getStatus(orderId);\n}\n\npublic ShippingStatus shippingFallback(String orderId, Throwable ex) {\n    return ShippingStatus.unknown();\n}",
    "exampleTitle": "ShippingService.java",
    "interview": "A circuit breaker is not the same as a retry. Retry attempts another call; a circuit breaker stops calls when failure levels are high.",
    "learningQuestions": [
      "What problem does Circuit Breaker solve?",
      "What failure mode or trade-off should you consider with Circuit Breaker?",
      "How could you implement Circuit Breaker in a Spring Boot system?"
    ],
    "caution": "Fallbacks must be meaningful; do not silently fabricate success."
  },
  {
    "id": "ms-saga",
    "name": "Saga Pattern",
    "category": "Microservices",
    "short": "SA",
    "summary": "Coordinate a business transaction across services using a sequence of local transactions and compensating actions.",
    "explanation": "A Saga avoids one distributed ACID transaction spanning independent service databases. Each step commits locally and triggers the next step. If a later step fails, compensating actions attempt to semantically undo earlier work.",
    "intent": "Maintain business consistency across multiple services without a global database transaction.",
    "problem": "A single business operation may update Order, Payment, and Inventory databases that cannot share a normal local transaction.",
    "structure": [
      "Execute local transaction A and publish/trigger the next step.",
      "Execute local transaction B, then subsequent steps.",
      "On failure, run compensating actions in reverse business order where appropriate.",
      "Track saga state and make steps idempotent."
    ],
    "tradeoffs": [
      "Supports independent databases and long-running workflows.",
      "Compensation is not always a perfect rollback (for example, a refund is a new transaction).",
      "Requires idempotency, observability, timeouts, and recovery handling."
    ],
    "relatedPatterns": "Transactional Outbox, Event-Driven Architecture, Process Manager, Retry.",
    "scenario": "Create order → reserve inventory → charge payment. If payment fails, release the inventory reservation and mark the order failed.",
    "useCases": [
      "Order fulfillment.",
      "Travel booking, payment workflows, and other multi-service business processes."
    ],
    "goal": "Coordinate distributed business transactions with local commits and compensation.",
    "spring": "Can be implemented with choreography via Kafka events or orchestration with a dedicated saga/process manager.",
    "code": "// Simplified saga orchestration pseudocode\ntry {\n    orderService.create(orderId);\n    inventoryService.reserve(orderId);\n    paymentService.charge(orderId);\n    orderService.confirm(orderId);\n} catch (RuntimeException failure) {\n    paymentService.refundIfCharged(orderId); // idempotent\n    inventoryService.releaseIfReserved(orderId);\n    orderService.markFailed(orderId);\n    throw failure;\n}",
    "exampleTitle": "OrderSaga.java (illustrative)",
    "interview": "Differentiate choreography (services react to events) from orchestration (a coordinator directs the workflow). Compensation is a business action, not necessarily a database rollback.",
    "learningQuestions": [
      "What problem does Saga Pattern solve?",
      "What failure mode or trade-off should you consider with Saga Pattern?",
      "How could you implement Saga Pattern in a Spring Boot system?"
    ],
    "caution": "Requires idempotency, observability, timeouts, and recovery handling."
  },
  {
    "id": "ms-cqrs",
    "name": "CQRS",
    "category": "Microservices",
    "short": "CQ",
    "summary": "Separate the model used to change data from the model used to query data.",
    "explanation": "Command Query Responsibility Segregation uses different paths or models for commands (state-changing operations) and queries (read-only operations). Read and write models may be physically separate, but they do not have to be.",
    "intent": "Optimize complex read and write workloads independently when their needs differ.",
    "problem": "A single model can become awkward when transactional writes and diverse read views have very different requirements.",
    "structure": [
      "Commands express intent to change state and go through validation.",
      "Write model enforces domain rules and persists changes.",
      "Events or projections update read models if separate.",
      "Queries read from models shaped for retrieval."
    ],
    "tradeoffs": [
      "Can simplify specialized read views and scale reads separately.",
      "Adds projection maintenance and possible eventual consistency.",
      "Often unnecessary for straightforward CRUD applications."
    ],
    "relatedPatterns": "Event Sourcing (often paired, but not required), Materialized View, Saga.",
    "scenario": "Order commands update normalized order state while a read projection serves a fast customer order-history page.",
    "useCases": [
      "Read-heavy systems with complex query needs.",
      "Systems with clearly different read and write scaling or data models."
    ],
    "goal": "Separate write responsibilities from read responsibilities.",
    "spring": "Can be implemented with separate Spring services, handlers, repositories, and optional asynchronous projections.",
    "code": "// Command model\npublic record PlaceOrderCommand(String customerId, List<String> itemIds) {}\n\n@Service\nclass PlaceOrderHandler {\n    public void handle(PlaceOrderCommand command) {\n        // Validate domain rules and persist the order.\n    }\n}\n\n// Query model\npublic record OrderSummary(String orderId, String status, double total) {}\n\n@Service\nclass OrderQueryService {\n    public List<OrderSummary> findOrders(String customerId) {\n        // Read from a query-optimized view or repository.\n        return List.of();\n    }\n}",
    "exampleTitle": "CQRSExample.java",
    "interview": "CQRS does not require event sourcing or separate databases. Start with logical separation and add separate read stores only when justified.",
    "learningQuestions": [
      "What problem does CQRS solve?",
      "What failure mode or trade-off should you consider with CQRS?",
      "How could you implement CQRS in a Spring Boot system?"
    ],
    "caution": "Often unnecessary for straightforward CRUD applications."
  },
  {
    "id": "ms-event-sourcing",
    "name": "Event Sourcing",
    "category": "Microservices",
    "short": "ES",
    "summary": "Store state changes as an append-only sequence of domain events and derive current state by replaying them.",
    "explanation": "Instead of persisting only the latest state, the system records events such as OrderPlaced, PaymentCaptured, and OrderShipped. Current state can be rebuilt by applying events in order, and projections can support queries.",
    "intent": "Preserve the history of meaningful state changes as the source of truth.",
    "problem": "A normal update-in-place table may not retain enough history to explain how an entity reached its current state.",
    "structure": [
      "Command is validated against current aggregate state.",
      "A domain event is appended to the event store.",
      "Aggregate state is reconstructed by replay or snapshots.",
      "Projections consume events to build query views."
    ],
    "tradeoffs": [
      "Provides strong audit history and replay capability.",
      "Requires event versioning, projection rebuilds, snapshots, and operational expertise.",
      "Events are durable facts; changing old events usually requires explicit migration strategies."
    ],
    "relatedPatterns": "CQRS, Transactional Outbox, Saga.",
    "scenario": "An account balance is derived from AccountOpened, MoneyDeposited, and MoneyWithdrawn events.",
    "useCases": [
      "Auditable domains.",
      "Systems needing temporal history or rebuilding multiple read projections."
    ],
    "goal": "Make the event history the source of truth.",
    "spring": "Often implemented with event-store technology or carefully designed append-only storage and event handlers.",
    "code": "// Illustrative domain events\nsealed interface OrderEvent permits OrderPlaced, OrderPaid {}\nrecord OrderPlaced(String orderId, double total) implements OrderEvent {}\nrecord OrderPaid(String orderId, String paymentId) implements OrderEvent {}\n\n// Current state is derived by applying stored events in sequence.\n// Production systems also need event schema/version management.",
    "exampleTitle": "OrderEvents.java",
    "interview": "Event sourcing is not just logging. Events are the authoritative state history. CQRS and event sourcing can be used independently.",
    "learningQuestions": [
      "What problem does Event Sourcing solve?",
      "What failure mode or trade-off should you consider with Event Sourcing?",
      "How could you implement Event Sourcing in a Spring Boot system?"
    ],
    "caution": "Events are durable facts; changing old events usually requires explicit migration strategies."
  },
  {
    "id": "ms-bulkhead",
    "name": "Bulkhead",
    "category": "Microservices",
    "short": "BH",
    "summary": "Isolate resource pools so a failing dependency or workload cannot consume all resources.",
    "explanation": "The pattern takes its name from ship compartments. Separate thread pools, connection pools, semaphores, or concurrency limits isolate failures and slow workloads.",
    "intent": "Limit the blast radius of a failure by partitioning resources.",
    "problem": "If every outbound call shares one resource pool, a slow dependency can exhaust it and block unrelated requests.",
    "structure": [
      "Identify independent dependencies or workload classes.",
      "Allocate separate concurrency or resource limits.",
      "Reject or queue excess work according to policy.",
      "Monitor saturation and tune capacity."
    ],
    "tradeoffs": [
      "Improves isolation and predictable degradation.",
      "Consumes more baseline resources and requires capacity planning.",
      "Too-small limits can reject legitimate traffic."
    ],
    "relatedPatterns": "Circuit Breaker, Timeout, Rate Limiter.",
    "scenario": "Payment calls and recommendation calls use separate concurrency limits so a slow recommendation service does not starve checkout.",
    "useCases": [
      "Services with multiple independent remote dependencies.",
      "Preventing one slow workload from exhausting all threads or connections."
    ],
    "goal": "Contain resource exhaustion to one dependency or workload.",
    "spring": "Resilience4j Bulkhead offers semaphore and thread-pool bulkhead approaches.",
    "code": "@Bulkhead(name = \"recommendations\", type = Bulkhead.Type.SEMAPHORE)\npublic List<String> recommendations(String customerId) {\n    return recommendationClient.fetch(customerId);\n}",
    "exampleTitle": "RecommendationService.java",
    "interview": "Bulkhead isolates concurrent resource use; a circuit breaker stops calls based on failure behavior. They are complementary.",
    "learningQuestions": [
      "What problem does Bulkhead solve?",
      "What failure mode or trade-off should you consider with Bulkhead?",
      "How could you implement Bulkhead in a Spring Boot system?"
    ],
    "caution": "Too-small limits can reject legitimate traffic."
  },
  {
    "id": "ms-retry",
    "name": "Retry",
    "category": "Microservices",
    "short": "RT",
    "summary": "Retry a failed operation when the failure is likely to be temporary and retrying is safe.",
    "explanation": "Retries can recover from brief network errors, throttling, or temporary service unavailability. Use a bounded attempt count, backoff, and jitter, and retry only errors that are plausibly transient.",
    "intent": "Recover automatically from transient failures.",
    "problem": "A single temporary failure can fail a request even though the dependency becomes healthy moments later.",
    "structure": [
      "Classify retryable versus non-retryable failures.",
      "Set a maximum attempt count and total deadline.",
      "Use exponential backoff and jitter where appropriate.",
      "Ensure operations are idempotent or use idempotency keys."
    ],
    "tradeoffs": [
      "Can improve success rates for transient faults.",
      "Aggressive retries amplify load and can cause retry storms.",
      "Never blindly retry non-idempotent payment or creation requests."
    ],
    "relatedPatterns": "Circuit Breaker, Timeout, Bulkhead, Idempotency.",
    "scenario": "Retry a safe GET request after a brief connection reset, with a small bounded retry budget.",
    "useCases": [
      "Transient network faults.",
      "Temporary HTTP 429 or 503 responses when policy and Retry-After permit it."
    ],
    "goal": "Recover from transient faults without amplifying an outage.",
    "spring": "Resilience4j Retry supports configurable attempts, exception filters, and wait durations.",
    "code": "@Retry(name = \"catalogLookup\")\npublic Product findProduct(String id) {\n    return catalogClient.getProduct(id);\n}",
    "exampleTitle": "CatalogService.java",
    "interview": "Retries need timeouts and bounded budgets. Retrying every failure immediately can make outages worse.",
    "learningQuestions": [
      "What problem does Retry solve?",
      "What failure mode or trade-off should you consider with Retry?",
      "How could you implement Retry in a Spring Boot system?"
    ],
    "caution": "Never blindly retry non-idempotent payment or creation requests."
  },
  {
    "id": "ms-timeout",
    "name": "Timeout",
    "category": "Microservices",
    "short": "TO",
    "summary": "Place an upper bound on how long a caller waits for a remote operation.",
    "explanation": "A timeout prevents requests from waiting indefinitely for a dependency. Configure connection and response/read timeouts, and propagate an overall deadline across nested calls.",
    "intent": "Bound latency and release resources when a dependency is slow or unreachable.",
    "problem": "Without timeouts, blocked calls can occupy threads and connections until the service becomes unhealthy.",
    "structure": [
      "Set connection and response/read timeouts on outbound clients.",
      "Define an end-to-end request deadline.",
      "Ensure downstream timeouts fit within the remaining deadline.",
      "Handle timeout failures explicitly."
    ],
    "tradeoffs": [
      "Protects resources and latency budgets.",
      "Too-short timeouts create false failures; too-long timeouts waste resources.",
      "A client timeout does not guarantee the server stopped processing the operation."
    ],
    "relatedPatterns": "Retry, Circuit Breaker, Bulkhead.",
    "scenario": "An order request has a 2-second budget; a downstream inventory call receives only the remaining portion of that budget.",
    "useCases": [
      "HTTP clients, database calls, and RPC requests.",
      "Preventing hung dependencies from consuming resources."
    ],
    "goal": "Bound waiting time and preserve an end-to-end latency budget.",
    "spring": "Configure timeouts on the specific HTTP client (RestClient's underlying request factory, WebClient connector, or other client).",
    "code": "// Illustrative Java HttpClient timeout\nHttpClient client = HttpClient.newBuilder()\n    .connectTimeout(Duration.ofSeconds(1))\n    .build();\n\nHttpRequest request = HttpRequest.newBuilder(uri)\n    .timeout(Duration.ofSeconds(2))\n    .GET()\n    .build();",
    "exampleTitle": "HttpTimeoutExample.java",
    "interview": "Timeouts are foundational. A retry policy must fit within the total deadline, not restart an unlimited wait each time.",
    "learningQuestions": [
      "What problem does Timeout solve?",
      "What failure mode or trade-off should you consider with Timeout?",
      "How could you implement Timeout in a Spring Boot system?"
    ],
    "caution": "A client timeout does not guarantee the server stopped processing the operation."
  },
  {
    "id": "ms-outbox",
    "name": "Transactional Outbox",
    "category": "Microservices",
    "short": "OB",
    "summary": "Persist business data and an event record in the same local database transaction, then publish the event asynchronously.",
    "explanation": "Writing to a database and publishing to a broker are two separate operations. If the database commit succeeds but publishing fails, downstream services may never hear about the change. The outbox stores the event in the same transaction as the business update; a relay publishes pending records later.",
    "intent": "Avoid the dual-write inconsistency between a database update and message publication.",
    "problem": "A service can commit an order and crash before sending OrderCreated to Kafka.",
    "structure": [
      "Update business rows and insert an outbox row in one local transaction.",
      "A polling relay or CDC process reads committed outbox rows.",
      "Publish events to the broker.",
      "Mark or track delivery and make consumers idempotent."
    ],
    "tradeoffs": [
      "Makes event publication recoverable after local commit.",
      "Events may be delivered more than once, so consumers need idempotency.",
      "Requires cleanup, monitoring, ordering strategy, and relay operations."
    ],
    "relatedPatterns": "Saga, Event Sourcing, Idempotent Consumer.",
    "scenario": "Order Service commits an order and OrderCreated outbox row atomically; a relay publishes the event to Kafka after commit.",
    "useCases": [
      "Publishing domain events after database changes.",
      "Reliable asynchronous integration across service boundaries."
    ],
    "goal": "Reliably bridge a local database transaction and message broker.",
    "spring": "Can be implemented with a relational outbox table and polling relay or CDC tooling such as Debezium.",
    "code": "// Within ONE database transaction\n@Transactional\npublic void createOrder(Order order) {\n    orderRepository.save(order);\n    outboxRepository.save(new OutboxEvent(\n        UUID.randomUUID().toString(),\n        \"OrderCreated\",\n        serialize(order)\n    ));\n}\n\n// A separate relay publishes pending outbox rows to the broker.",
    "exampleTitle": "OrderService.java",
    "interview": "The outbox solves the database-plus-broker dual-write problem; it does not guarantee exactly-once effects in every downstream system.",
    "learningQuestions": [
      "What problem does Transactional Outbox solve?",
      "What failure mode or trade-off should you consider with Transactional Outbox?",
      "How could you implement Transactional Outbox in a Spring Boot system?"
    ],
    "caution": "Requires cleanup, monitoring, ordering strategy, and relay operations."
  },
  {
    "id": "ms-db-per-service",
    "name": "Database per Service",
    "category": "Microservices",
    "short": "DB",
    "summary": "Give each service ownership of its data and prevent other services from directly depending on its tables.",
    "explanation": "A service owns its schema and exposes data through APIs or events. The database may be a separate instance or a logically isolated schema, depending on operational needs; the important boundary is ownership and avoiding cross-service table coupling.",
    "intent": "Allow each service to evolve its data model independently.",
    "problem": "Shared tables let one service's schema changes break another service and create hidden coupling.",
    "structure": [
      "A service owns its tables and migration lifecycle.",
      "Other services use its API or consume published events.",
      "Cross-service queries use APIs, projections, or data pipelines rather than direct table joins.",
      "Cross-service transactions use patterns such as Saga when necessary."
    ],
    "tradeoffs": [
      "Enables independent schema evolution and ownership.",
      "Makes joins and transactions across services more complex.",
      "Duplicated read data and eventual consistency may be needed."
    ],
    "relatedPatterns": "CQRS, Saga, API Composition, Event-Driven Architecture.",
    "scenario": "Order Service owns order tables; Payment Service owns payment records; neither directly updates the other's database.",
    "useCases": [
      "Teams deploy services independently.",
      "Data ownership and service boundaries need to be explicit."
    ],
    "goal": "Reduce schema coupling and clarify ownership.",
    "spring": "Use separate repositories and migration ownership per service; separate database servers are an operational choice, not an absolute rule.",
    "code": "// Order Service owns this repository and its schema\ninterface OrderRepository extends JpaRepository<Order, UUID> {}\n\n// Payment Service should not inject OrderRepository or write order tables.\n// It calls an Order API or consumes an OrderCreated event instead.",
    "exampleTitle": "ServiceDataOwnership.java",
    "interview": "Database per service means independent ownership, not necessarily one physical database server per service.",
    "learningQuestions": [
      "What problem does Database per Service solve?",
      "What failure mode or trade-off should you consider with Database per Service?",
      "How could you implement Database per Service in a Spring Boot system?"
    ],
    "caution": "Duplicated read data and eventual consistency may be needed."
  },
  {
    "id": "ms-strangler-fig",
    "name": "Strangler Fig",
    "category": "Microservices",
    "short": "SF",
    "summary": "Modernize a legacy system incrementally by routing selected functionality to new services over time.",
    "explanation": "Rather than replacing a large application in one risky release, introduce a routing layer and migrate capability by capability. New functionality is implemented in the new system while remaining traffic continues to use the legacy application.",
    "intent": "Reduce migration risk by replacing a legacy system in small, reversible steps.",
    "problem": "A big-bang rewrite can take too long, delay value, and create a risky cutover.",
    "structure": [
      "Place a proxy, gateway, or routing facade in front of the legacy application.",
      "Choose a small capability to migrate.",
      "Route that capability to the new service and keep remaining paths on legacy.",
      "Measure behavior, retire migrated code, and repeat."
    ],
    "tradeoffs": [
      "Enables incremental delivery and rollback.",
      "Requires temporary coexistence, routing, data synchronization, and clear ownership.",
      "Avoid leaving the migration layer permanent without a plan."
    ],
    "relatedPatterns": "API Gateway, Anti-Corruption Layer, Branch by Abstraction.",
    "scenario": "Move customer-profile endpoints from a monolith to Customer Service while billing and reporting remain in the monolith.",
    "useCases": [
      "Legacy modernization.",
      "Gradually extracting microservices from a monolith."
    ],
    "goal": "Replace legacy capabilities incrementally rather than all at once.",
    "spring": "Can use Spring Cloud Gateway or an edge proxy for routing while the legacy and new services coexist.",
    "code": "// Illustrative routing rule\nif (request.path().startsWith(\"/api/customers\")) {\n    routeTo(\"customer-service\");\n} else {\n    routeTo(\"legacy-monolith\");\n}",
    "exampleTitle": "MigrationRouting.java (pseudocode)",
    "interview": "Strangler Fig is a migration strategy, not simply a service-to-service communication pattern. Plan data ownership and the final removal of legacy routes.",
    "learningQuestions": [
      "What problem does Strangler Fig solve?",
      "What failure mode or trade-off should you consider with Strangler Fig?",
      "How could you implement Strangler Fig in a Spring Boot system?"
    ],
    "caution": "Avoid leaving the migration layer permanent without a plan."
  },
  {
    "id": "ms-rate-limiter",
    "name": "Rate Limiting",
    "category": "Microservices",
    "short": "RL",
    "summary": "Limit how many requests a client or service can make within a defined interval.",
    "explanation": "Rate limiting protects capacity and fairness by controlling request volume. Common algorithms include token bucket, leaky bucket, fixed window, and sliding window. Limits may be per user, API key, tenant, or endpoint.",
    "intent": "Protect services from overload, abuse, and unfair resource consumption.",
    "problem": "Unbounded traffic or noisy clients can consume capacity and degrade service for everyone.",
    "structure": [
      "Identify the key used to group requests.",
      "Track usage with a chosen algorithm.",
      "Allow requests within the budget and reject or delay excess requests.",
      "Return clear rate-limit metadata when appropriate."
    ],
    "tradeoffs": [
      "Protects capacity and improves fairness.",
      "Distributed counters and clock/window behavior need care.",
      "Limits should reflect service capacity and user expectations."
    ],
    "relatedPatterns": "Bulkhead, API Gateway, Load Shedding.",
    "scenario": "An API allows each API key 100 requests per minute and returns HTTP 429 when the limit is exceeded.",
    "useCases": [
      "Public APIs.",
      "Tenant fairness and protection against bursts or accidental loops."
    ],
    "goal": "Control request rate at a defined boundary.",
    "spring": "Can be applied at an API gateway or implemented with a library and a shared counter store for distributed limits.",
    "code": "// Controller-level pseudocode; actual limiting belongs in a filter/gateway/library\nif (!rateLimiter.tryAcquire(apiKey)) {\n    throw new TooManyRequestsException(); // map to HTTP 429\n}\nreturn service.handle(request);",
    "exampleTitle": "RateLimitExample.java",
    "interview": "Distinguish rate limiting (requests over time) from bulkheads (concurrent resource isolation) and load shedding (rejecting work under overload).",
    "learningQuestions": [
      "What problem does Rate Limiting solve?",
      "What failure mode or trade-off should you consider with Rate Limiting?",
      "How could you implement Rate Limiting in a Spring Boot system?"
    ],
    "caution": "Limits should reflect service capacity and user expectations."
  },
  {
    "id": "ms-idempotent-consumer",
    "name": "Idempotent Consumer",
    "category": "Microservices",
    "short": "IC",
    "summary": "Make repeated delivery of the same message safe by detecting duplicates or designing operations to be idempotent.",
    "explanation": "Message brokers and network clients may redeliver messages. A consumer can record a stable message/event ID in the same transaction as its business effect, so a duplicate delivery does not apply the effect twice.",
    "intent": "Prevent duplicate message delivery from causing duplicate business effects.",
    "problem": "A consumer can process a message successfully and crash before acknowledging it, causing the broker to deliver it again.",
    "structure": [
      "Every event has a stable unique identifier.",
      "Consumer checks whether the identifier has already been processed.",
      "Business update and processed-message record commit atomically.",
      "A duplicate is acknowledged or ignored safely."
    ],
    "tradeoffs": [
      "Makes at-least-once delivery practical for many workflows.",
      "Requires durable deduplication storage and retention policy.",
      "Exactly-once end-to-end effects still require careful design across boundaries."
    ],
    "relatedPatterns": "Transactional Outbox, Saga, Retry.",
    "scenario": "A duplicate PaymentRequested event must not charge a customer twice; use a payment idempotency key and durable processing state.",
    "useCases": [
      "Kafka or RabbitMQ consumers.",
      "Payment, order creation, and other operations where duplicates are costly."
    ],
    "goal": "Make retries and redelivery safe.",
    "spring": "Use event IDs, unique constraints, and transactional updates in message consumers.",
    "code": "@Transactional\npublic void consume(OrderCreated event) {\n    if (processedEventRepository.existsById(event.eventId())) {\n        return; // duplicate delivery\n    }\n\n    updateProjection(event);\n    processedEventRepository.save(new ProcessedEvent(event.eventId()));\n}",
    "exampleTitle": "OrderCreatedConsumer.java",
    "interview": "The processed-event record and business effect must be atomic, or a crash can still create duplicates or lost processing.",
    "learningQuestions": [
      "What problem does Idempotent Consumer solve?",
      "What failure mode or trade-off should you consider with Idempotent Consumer?",
      "How could you implement Idempotent Consumer in a Spring Boot system?"
    ],
    "caution": "Exactly-once end-to-end effects still require careful design across boundaries."
  },
  {
    "id": "ms-anti-corruption-layer",
    "name": "Anti-Corruption Layer",
    "category": "Microservices",
    "short": "ACL",
    "summary": "Translate an external or legacy model into the domain model used by your service.",
    "explanation": "An anti-corruption layer protects a service's domain language from being shaped by an external system's terminology, data formats, and quirks. It often contains translators, adapters, and mapping code.",
    "intent": "Keep an external model from leaking through the boundaries of your domain.",
    "problem": "Directly spreading legacy field names, status codes, and assumptions throughout a new service creates tight coupling.",
    "structure": [
      "Define the internal domain model and language.",
      "Create a translation boundary for the external API or data.",
      "Map external requests and responses to internal types.",
      "Keep integration-specific errors and semantics inside the boundary."
    ],
    "tradeoffs": [
      "Protects domain clarity and eases vendor changes.",
      "Adds mapping code and another layer to maintain.",
      "Do not duplicate the entire external system unnecessarily."
    ],
    "relatedPatterns": "Adapter, Facade, Strangler Fig.",
    "scenario": "A new Order Service translates legacy status values like 'P' and 'X' into internal Pending and Cancelled states.",
    "useCases": [
      "Integrating legacy systems.",
      "Working with third-party providers whose domain model differs from yours."
    ],
    "goal": "Isolate external models and terminology from internal domain logic.",
    "spring": "Implement an adapter/integration module that maps external DTOs to internal domain objects.",
    "code": "record LegacyOrderDto(String id, String statusCode) {}\nrecord Order(String id, OrderStatus status) {}\nenum OrderStatus { PENDING, CANCELLED, COMPLETED }\n\nOrder toDomain(LegacyOrderDto dto) {\n    OrderStatus status = switch (dto.statusCode()) {\n        case \"P\" -> OrderStatus.PENDING;\n        case \"X\" -> OrderStatus.CANCELLED;\n        case \"C\" -> OrderStatus.COMPLETED;\n        default -> throw new IllegalArgumentException(\"Unknown status\");\n    };\n    return new Order(dto.id(), status);\n}",
    "exampleTitle": "LegacyOrderMapper.java",
    "interview": "An Adapter solves interface compatibility; an Anti-Corruption Layer is a broader domain boundary that may include several adapters and translators.",
    "learningQuestions": [
      "What problem does Anti-Corruption Layer solve?",
      "What failure mode or trade-off should you consider with Anti-Corruption Layer?",
      "How could you implement Anti-Corruption Layer in a Spring Boot system?"
    ],
    "caution": "Do not duplicate the entire external system unnecessarily."
  }
];
