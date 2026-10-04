(function () {
  var Pending = new Map();
  var Listeners = new Map();
  var NextId = 0;

  function Dispatch(Message) {
    if (Message.Event) {
      var Handlers = Listeners.get(Message.Event);
      if (Handlers) Handlers.forEach(function (Handler) { Handler(Message.Payload); });
      return;
    }

    var Request = Pending.get(Message.Id);
    if (!Request) return;
    Pending.delete(Message.Id);

    if (Message.Ok) Request.Resolve(Message.Result);
    else Request.Reject(new Error(Message.Error));
  }

  window.chrome.webview.addEventListener("message", function (Event) { Dispatch(Event.data); });

  window.Eon = {
    Invoke: function (Method, Args) {
      NextId += 1;
      var Id = NextId;
      return new Promise(function (Resolve, Reject) {
        Pending.set(Id, { Resolve: Resolve, Reject: Reject });
        window.chrome.webview.postMessage({ Id: Id, Method: Method, Args: Args || {} });
      });
    },

    Listen: function (Event, Handler) {
      if (!Listeners.has(Event)) Listeners.set(Event, new Set());
      Listeners.get(Event).add(Handler);
      return function () { Listeners.get(Event).delete(Handler); };
    }
  };
})();
