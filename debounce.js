// ------------------------------- Debounce ----------------------------
// implements a wrapper around a callback and a setTimeout channel which
// is triggered by calling the wrapper. triggering cancels and restarts 
// the timeout, and the callback is only executed once the callback has
// elapsed. so basically this is a handy way to have an action which has
// multiple triggers that may fire many times before the action runs, and
// and does not need to be invoked per-trigger. 

class Debounce
{
  constructor(wrapped, bouncetime) {
    this.wrapped = wrapped;
    this.bouncetime = bouncetime;
    this.args = [];
    this.timeout = null;
  }

  fire() {
    if(this.timeout != null)
    {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    var oldargs = this.args;
    this.args = [];
    this.wrapped(oldargs);
  }

  call(...args) {
    if(this.timeout != null)
    {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.args.push(Array.from(args));
    this.timeout = setTimeout(()=>{this.fire()}, this.bouncetime);
  }

  ispending() {
    return this.timeout != null;
  }

  cancel() {
    if(this.timeout != null)
    {
      clearTimeout(this.timeout);
      this.timeout=null;
      this.args=[];
      return true;
    }
    return false;
  }
}
