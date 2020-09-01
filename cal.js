brackets={
	"[":false,
	"]":true,
	"{":false,
	"}":true
}
function calc(input,ignore,depth){
	if(depth==undefined){
		depth=1
	}else{
		depth++
	}
	input=input.toLowerCase()
	while(input.includes("--")){
		input=input.replace("--","+")
	}
	while(input.includes("pi")){
		input=input.replace("pi",Math.PI)
	}
	for(i in brackets){
		while(input.includes(i)){
			input=input.replace(i,brackets[i]?")":"(")
		}
	}
	while(input.includes(" ")){
		input=input.replace(" ","")
	}
	var brc=0
	var remove=[]
	var count=0
	var start
	var content
	for(i of input){
		if(i==")"){
			brc--
			if(brc==0){
				remove[remove.length]=[start,count,content]
			}
		}
		if(brc>0){
			content+=i
		}
		if(i=="("){
			if(brc==0){
				start=count
				content=""
			}
			brc++
		}
		if(brc<0){
			console.error("  ".repeat(depth-1)+"wrong brackets "+(count+1)+" in "+ input+" in depth "+depth)
			return NaN
		}
		count++
	}
	if(brc>0){
		var br=""
		for(i=0;i!=(brc-1);i++){
			br+=")"
		}
		remove[remove.length]=[start,count+brc,content+br]
	}
	for(i=0;i!=brc;i++){
		input+=")"
	}
	if(ignore){
	console.log(remove)
	console.log("  ".repeat(depth-1)+depth+": "+input)
	}
	for(i in remove){
		var y=remove.length-i-1
		var chose
		try {
			chose=input[remove[y][0]-3]+input[remove[y][0]-2]+input[remove[y][0]-1]
			if(arit.includes(chose)){
				if(arit.includes(chose)&&arit.includes(input[remove[y][0]-4])){
					chose=input[remove[y][0]-4]+chose;
					if(!arit.includes(chose)){
						chose=input[remove[y][0]-3]+input[remove[y][0]-2]+input[remove[y][0]-1]
					}
				}
			}else{
				chose=""
			}
		} catch (error) {
			chose=""
		}
		var out=fun(chose,calc(remove[y][2],ignore,depth))
		if(!out&&out!==0){console.error("  ".repeat(depth-1)+"err in depth "+depth+": "+chose+"("+remove[y][2]+")"+" return "+out)}
		input=input.slice(0,remove[y][0]-chose.length)+(num.includes(input[remove[y][0]-1-chose.length])?"*":"")+out+(num.includes(input[remove[y][1]+1])?"*":"")+input.slice(remove[y][1]+1,undefined)
	}
	while(input.includes("--")){
		input=input.replace("--","+")
	}
	while(input.includes("+-")){
		input=input.replace("+-","-")
	}
	while(input.includes("**")){
		let a=afterindex(input,input.lastIndexOf("**")+1)
		let b=beforeindex(input,input.lastIndexOf("**"))
		input = replacelast(input,b+"**"+a,b**a)
	}
	if(ignore){
	console.log("  ".repeat(depth-1)+depth+": "+input)
	}
	plusa=input.split(/(?<!e)[+]/g)
	let plus=undefined
	for(i of plusa){
		let minus=undefined
		if(i[0]=="-"){i="0"+i}
		minusa=i.split(/(?<![/*e])[-]/g)
		for(y of minusa){
			let mul=undefined
			mula=y.split("*")
			for(z of mula){
				let dev=undefined
				deva=z.split("/")
				for(j of deva){
					if(dev!=undefined){
						dev=dev/parseFloat(j)
					}else{
						dev=parseFloat(j)
					}
				}
				if(mul!=undefined){
					mul=mul*dev
				}else{
					mul=dev
				}
			}
			if(minus!=undefined){
				minus=minus-mul
			}else{
				minus=mul
			}
		}
		if(plus!=undefined){
			plus=plus+minus
		}else{
			plus=minus
		}
	}
	return plus
}
var arit="asinacosatandtrtd"
function fun(a,input){
	switch(a){
		case "sin":
		return Math.sin(input)
		case "cos":
		return Math.cos(input)
		case "tan":
		return Math.tan(input)
		case "asin":
		return Math.asin(input)
		case "acos":
		return Math.acos(input)
		case "atan":
		return Math.atan(input)
		case "dtr":
		return dtr(input)
		case "rtd":
		return rtd(input)
		default:
		return input
	}
}
function dtr(a){
	return Math.PI/180*a
}
function rtd(a){
	return a/Math.PI*180
}
var num="0123456789."
function afterindex(input,index){
	index++
	ret=""
	while(num.includes(input[index])){
		ret+=input[index]
		index++
	}
	return parseFloat(ret)
}
function beforeindex(input,index){
	index--
	ret=""
	while(num.includes(input[index])){
		ret=input[index]+ret
		index--
	}
	return parseFloat(ret)
}
function replacelast(input,torep,rep){
	index=input.lastIndexOf(torep);
	b = input.substring(0, index);
	a = input.substring(index + torep.length, input.length);
	return b + rep + a;
}
safefuns=["","sin","cos","tan","dtr","rtd"]
signs=["+","-","*","/","**"]
function test(size,bracch,bracsize,depth) {
	if(!size){size=10}
	if(!bracch){bracch=0.1}
	if(!bracsize){bracsize=10}
	if(!depth){depth=10}
	let inp=rectest(size,bracch,bracsize,depth)
	try {
		inpv=calc(inp)
		console.log("testing for("+inp+" = "+inpv+") succesfully")
		console.log(inpv)
	} catch (error) {
		console.error("testing for("+inp+") went wrong.")
		console.error(error)
	}
}
function rectest(size,bracch,bracsize,depth){
	let output=""
	for(let i=0;i<size;i++){
		if(Math.random()<bracch&&depth!=0){
			output+=safefuns[Math.floor(Math.random()*6)]+"("+rectest(bracsize,bracch,bracsize,depth-1)+")"
		}else{
			output+=Math.random()*1000**Math.random()
		}
		if(i!=(size-1)){
			output+=signs[Math.floor(Math.random()*4)]
		}
	}
	return output
}