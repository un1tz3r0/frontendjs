// simple method for deferring execution of setup or other initialization code while the DOM is still loading
// if invoked by a script tag in, for instance, the document's head element, this will wait until the whole
// page has been loaded and all elements in the body have been created. otherwise it simply runs the callback
// right away. note that this does not ensure that external resources have been loaded, if you need to ensure
// that say a script tag with src= attribute has been loaded and executed because you need to reference some
// globals that the script defines, you will still need to bind to the onload event of the script tag. this 
// will only ensure that the script tag, if it appears after the script that calls it, exists (which is still
// useful since you can't bind an event on an element that doesn't exist yet!)

function addReadyListener(callback)
{
  function wrapper(event)
  {
    // catch and log exceptions that are thrown and not handled inside the callback. this is necessary because if the callback
    // throws an exception, it will otherwise propagate up to the caller, but only when not being called asynchronously. this 
    // could lead to unpredictable behavior since whether or not the callback is called asynchronwe ously could depend on how 
    // long it takes to retrieve the rest of the document, (i.e. the document may or may not be finished loading by the time
    // the script calls addReadyListener, but that shouldn't change whether or not an exception thrown in the callback can be
    // caught by the code calling addReadyListener.)
  	try 
    {
			callback();
		} 
    catch(err) 
    {
			console.error("ready callback raised an error:", err);
		}
  }

  if(document.readyState == "loading")
	{
		// defer executing callback until the DOM is finished loading, i.e. if we are run from a script tag in the document's head
    document.addEventListener("DOMContentLoaded", wrapper, false);
	}
	else
	{
    // if we are called any other time, simply execute the callback immediately
		wrapper(null);
	}
}

