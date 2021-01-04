function bindAttribute(attributeName, callback)
{
	if(!window.MutationObserver)
	{
		console.error("No MutationObserver support!!!");
	}
	else
	{
		function fireCallback(node, newValue, oldValue) {
			try {
				callback(node, newValue, oldValue);
			} catch(err) {
				console.error("uncaught exception raised by bindAttribute callback", err);
			}
		}
		
		function mutationCallback(mutationRecords, mutationObserver)
		{
			mutationRecords.forEach((mutation) => {
				if(mutation.type=="childList") {
					mutation.addedNodes.forEach((node) => {
						if(node.hasAttribute && node.hasAttribute(attributeName))
						{
							fireCallback(node, node.getAttribute(attributeName), null);
						}
						if(node.querySelectorAll) 
						{
							Array.from(node.querySelectorAll("["+CSS.escape(attributeName)+"]")).forEach((descendant)=>{
								fireCallback(descendant, descendant.getAttribute(attributeName), null);
							});
						}
					});
					mutation.removedNodes.forEach((node) => {
						if(node.hasAttribute && node.hasAttribute(attributeName))
						{
							fireCallback(node, null, node.getAttribute(attributeName));
						}
						if(node.querySelectorAll) 
						{
							Array.from(node.querySelectorAll("["+CSS.escape(attributeName)+"]")).forEach((descendant)=>{
								fireCallback(descendant, null, descendant.getAttribute(attributeName))
							});
						}
					});
				} 
				else if(mutation.type=="attributes")
				{
					// attribute mutations to mutation.target
					if(mutation.target.hasAttribute && mutation.target.hasAttribute(attributeName))
					{
						// fire callback for attribute change
						fireCallback(mutation.target, mutation.target.getAttribute(attributeName), mutation.oldValue);
					}
					else
					{
						// fire callback with oldValue == null for attribute removed
						fireCallback(mutation.target, null, mutation.oldValue);
					}
				}
			});
		}

		var observer = new MutationObserver(mutationCallback);

		observer.observe(document.documentElement, {childList: true, subtree: true, attributeOldValue: true, attributeFilter: [attributeName]});

		Array.from(document.querySelectorAll("["+CSS.escape(attributeName)+"]")).forEach((node) => {
			fireCallback(node, node.getAttribute(attributeName), null);
		});
  }
}

/*
  Excerpt from mozilla's developer docs on MutationObservers:

  MutationObserver(mutationCallback)
	Constructs a MutationObserver object and sets its callback to callback. The callback is invoked with a list of MutationRecord objects as first argument and the constructed MutationObserver object as second argument. It is invoked after nodes registered with the observe() method, are mutated.

  observe(node, options)
  Instructs the user agent to observe a given target (a node) and report any mutations based on the criteria given by options (an object).
  The options argument allows for setting mutation observation options via object members. These are the object members that can be used: 

  childList
  Set to true if mutations to target’s children are to be observed.
  attributes
  Set to true if mutations to target’s attributes are to be observed. Can be omitted if attributeOldValue or attributeFilter is specified.
  characterData
  Set to true if mutations to target’s data are to be observed. Can be omitted if characterDataOldValue is specified.
  subtree
  Set to true if mutations to not just target, but also target’s descendants are to be observed.
  attributeOldValue
  Set to true if attributes is true or omitted and target’s attribute value before the mutation needs to be recorded.
  characterDataOldValue
  Set to true if characterData is set to true or omitted and target’s data before the mutation needs to be recorded.
  attributeFilter
  Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted.

	observer.disconnect()
	Stops observer from observing any mutations. Until the observe() method is used again, observer’s callback will not be invoked.
	
	observer.takeRecords()
	Empties the record queue and returns what was in there.
*/
