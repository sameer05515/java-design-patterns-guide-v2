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
  }
];
