// adds data-maintain-aspect attribute-based aspect ratio restricted element sizing. whoa you lost me... ok:
// 
// 1. data-maintain-aspect="width 0.5" will keep the element's width equal to half of it's height, even if the height is changed, animated or transitioned
// 2. data-maintain-aspect="height 1.5" will keep the element's height set to one and a half times it's width, 
// 
// this requires the bindattribute.js in this repo, as it makes use of bindAttribute to detect and respond to custom data attribute
//
// just add the following snippet to initialize the binding handling, 
//
// addReadyListener(()=>{
//   var maintainAspect = MaintainAspectHandler();
//   maintainAspect.init()
// });

function MaintainAspectHandler()
{
	this.resizeObserver = null;
	this.attributeBinding = null;
	
	this.init = function()
	{
		if(window.ResizeObserver) {
       const resizeObserver = new ResizeObserver(entries => {
          for (let entry of entries) {
            if(entry.target.hasAttribute("data-maintain-aspect"))
						{
							var words = " ".split(entry.target.getAttribute("data-maintain-aspect"));
							if(words[0] == "width")
								entry.target.style.width =
Math.max(0, entry.contentRect.height*parseFloat(words[1])) + 'px';
							else
								entry.target.style.height =
Math.max(0, entry.contentRect.width/parseFloat(words[1])) + 'px';
		          console.log('Size changed ', entry.target, " ", entry.contentRect.width, "x", entry.contentRect.height);
						}
          }
          /*console.log('Size changed ', entry.target, " ", entry.contentRect.width, "x", entry.contentRect.height);*/
        });

      	var attributeBinding = bindAttribute("data-maintain-aspect", (node) => {
					if(node.hasAttribute("data-maintain-aspect")) {
						resizeObserver.observe(node);
					} else {
            resizeObserver.unobserve(node);
					}
				});

        this.resizeObserver = resizeObserver;
        this.attributeBinding = attributeBinding;
			} else {
        console.log('Resize observer not supported!');
      }
  };
}
