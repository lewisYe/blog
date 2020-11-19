1. Promise

function Promise (fn){
  this.status = 'pending'
  this.value = null
  this.reason = null
  this.resolveStack = []
  this.rejectStack = []

  function resolve(val){
    this.status = 'resolved'
    this.value = val
    this.resolveStack.map(fn=>{
      fn(this.status)
    })
  }

  function reject(val){
    this.status = 'rejected'
    this.reason = val
    this.rejectStack.map(fn=>{
      fn(this.reason)
    })
  }

  try{
    fn(resolve,reject)
  }catch(e){
    reject(e)
  }
 
}

Promise.prototype.then = function(onResolved,onRejected){
  if(this.status == 'pending'){
    this.rejectStack.push(onRejected)
    this.resolveStack.push(onResolved)
  }

  if(this.status == 'resolved'){
    onResolved(this.value)
  }

  if(this.status == 'rejected'){
    onRejected(this.reason)
  }
}

2. call 

Function.prototype.myCall = function(thisArg,...args){
  if(thisArg === null || thisArg === undefined){
    thisArg = window
  }else{
    thisArg = Object(thisArg)
  }

  const fn = Symbol('fn')
  thisArg[fn] = this
  const result = thisArg[fn](...args)

  delete thisArg[fn]

  return result
}

3. Function.prototype.myApply = function(thisArg,arr){
  if(thisArg === null || thisArg === undefined){
    thisArg = window
  }else{
    thisArg = Object(thisArg)
  }

  if(arr){
    const fn = Symbol('fn')
    thisArg[fn] = this
    const result = thisArg[fn](...arr)
  
    delete thisArg[fn]
  
    return result
  }
}

4. Function.prototype.myBind = function(thisArg){
  
}