/* ---------------------------------------------------------------------
WorkQueue - cooperative background rendering task management
------------------------------------------------------------------------ */

class WorkQueue 
{
	constructor(timeout=1000) {
		this._handle = null;
		this._deadline = null;
		this._tasks = [];
		this._canceled = false;
		this._timeout = timeout;
		this._done = false;
		this._after = [];
	}
	
	after(fn) {
		if(this._done)
		{
			fn(this._canceled);
		}
		else
		{
			this._after.push(fn);
		}
	}
	
	cancel() {
		if(!this.canceled)
		{
			this._canceled = true;
			if(this._handle != null) {
				cancelIdleCallback(this._handle);
				this._handle = null;
			}
			while(this._tasks.length > 0)
			{
				this._tasks.pop();
			}
			if(this._deadline == null)
			{
				this._done = true;
				for(let fn of this._after)
				{
					fn(this._canceled);
				}
			}
		}
	}
	
	run(deadline)
	{
		console.info(`entering WorkQueue.run() with ${this._tasks.length} tasks in queue, time remaining is ${deadline.timeRemaining()}`);
		this._deadline = deadline;
		this._handle = null;
		//this._deadline = deadline;
		//if(this._tasks.length == 0 || this._canceled) {
			// short circuit if queue is empty or canceled
			//this._handle = null;
			//return;
		//}
		var n = 0, m = this._tasks.length * 2;
		while((deadline.timeRemaining() > 0 || ((n < m) && deadline.didTimeout)) && this._tasks.length > 0 && !this._canceled)
		{
			n = n + 1;
			var t = this._tasks.shift();
			try {
				t[0].apply(null, t[1]);
			} catch(err) {
				console.error(`Uncaught exception thrown by deferred function ${t[0]} called with args ${t[1]}: ${err}`);
			}
		}

		if((this._tasks.length <= 0 || this._canceled) && !this._done) {
			this._done = true;
			for(let fn of this._after)
			{
				fn(this._canceled);
			}
		}
		
		this._deadline = null;
		if(this._tasks.length > 0 && !this._canceled) {
			this._handle = requestIdleCallback((dl)=>{this.run(dl);}, {timeout: this._timeout});
		}
	}
	
	schedule(func, ...args) {
		if(!this._canceled)
		{
			/*if(this._deadline != null && this._deadline.timeRemaining() > 0)
			{
				func.apply(null, Array.from(args));
			}
			else
			{*/
				this._tasks.push([func, Array.from(args)]);
				if(this._handle == null && this._deadline == null)
				{
					this._handle = requestIdleCallback((dl)=>{this.run(dl);}, {timeout: this._timeout});
				}
			//}
		}
	}
}

