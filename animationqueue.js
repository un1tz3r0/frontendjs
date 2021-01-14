// ------------------------------------------------------------------
// AnimationQueue -- store and schedule deferred calls encapsulating
// DOM updates which may be invalidated before they can be executed.
// use this to accumulate anything you would use a requestAnimationFrame
// callback to do, and group your related drawing operations in the same
// queue. When everything in the queue has been executed, the after()
// handlers will be called. If the updates are invalidated by say, new
// changes to data in your Model in an MVC architecture, then the pending
// update can be cancel()ed before you begin rendering the new updates.
// ------------------------------------------------------------------

class AnimationQueue {
	constructor() {
		this._handle = null;
		this._tasks = [];
		this._updating = false;
		this._lasttime = null;
		this._canceled = false;
		this._done = false;
		this._after = [];
	}
	
	after(fn) {
		if(this._done)
		{
			fn(this._canceled)
		}
		else
		{
			this._after.push(fn);
		}
	}
	
	cancel() {
		this._canceled = true;
		if(this._handle != null) {
			cancelAnimationFrame(this._handle);
			this._handle = null;
		}
		while(this._tasks.length > 0)
		{
			this._tasks.pop();
		}
		this._done = true;
		if(!this._updating)
		{
			for(let fn of this._after)
			{
				fn(this._canceled);
			}
		}
	}
	
	run(frametime) {
		console.info(`entering AnimationQueue.run() with ${this._tasks.length} tasks in queue, time remaining is ${frametime}`);
		
		this._updating = true;
		while(this._tasks.length > 0 && !this._canceled)
		{
			var t = this._tasks.shift();
			try {
				t[0].apply(null, t[1]);
			} catch(err) {
				console.error(`Uncaught exception thrown by update function ${t[0]} called with args ${t[1]}: ${err}`);
			}
		}
		
		if(this._tasks.length <= 0 || this._canceled && !this._done) {
			this._done = true;
			for(let fn of this._after)
			{
				fn(this._canceled);
			}
		}
		
		this._updating = false;
		this._handle = null;
		if(this._tasks.length > 0 && !this._canceled) {
			this._handle = requestAnimationFrame((t)=>{this.run(t);});
		}
	}
	
	schedule(func, ...args) {
		if(!this._canceled)
		{
			/*if(!this._updating)
			{*/
				this._tasks.push([func, Array.from(args)]);
				if(this._handle == null && !this._updating)
				{
					this._handle = requestAnimationFrame((tm)=>{this.run(tm);});
				}
			/*}
			else
			{
				func.apply(null, Array.from(args));
			}*/
		}
	}
}
