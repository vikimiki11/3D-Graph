//<polygon points="100,100 1550,100 1550,830 100,830" style="fill:lime;stroke:purple;stroke-width:1;" onclick="alert('ahoj')"></polygon>
var svg=undefined
var max=undefined
var min=undefined
var metrix=[]
var xjump=undefined
var yjump=undefined
var fov = 80
var downx=undefined
var downy=undefined
var res=undefined
var zangle=0.001
var xangle=0.001
var tick=1000/45
var camdist=125
var range
var width
var height
//Expression,[xmin,xmax,ymin,ymax],resolution
function makemetrix(expression,ranges,resolution){
	min=undefined
	max=undefined
	range=ranges
	res=resolution
	xjump=(ranges[1]-ranges[0])/res
	yjump=(ranges[3]-ranges[2])/res
	metrix=[]
	for(x=0;x<res+1;x++){
		metrix[x]=[]
		expx=expression
		while(expx.includes("x")){
			expx=expx.replace("x","("+(ranges[0]+xjump*x)+")")
		}
		for(y=0;y<res+1;y++){
			exp=expx
			while(exp.includes("y")){
				exp=exp.replace("y","("+(ranges[2]+yjump*y)+")")
			}
			metrix[x][y]=calc(exp,false)
			if(min==undefined || min>metrix[x][y]){
				min=metrix[x][y]
			}
			if(max==undefined || max<metrix[x][y]){
				max=metrix[x][y]
			}
		}
	}
	draw()
}
function draw() {
	width=svg.children[0].width.animVal.value
	height=svg.children[0].height.animVal.value
	short=width<height?width:height
	console.log(metrix)
	if(zangle>90){
		starty=0
		jy=1
		stopy=res-2
	}else{
		starty=res-2
		jy=-1
		stopy=0
	}
	if(zangle>0){
		startx=0
		jx=1
		stopx=res-2
	}else{
		startx=res-2
		jx=-1
		stopx=0
	}
	zapis=""
	for(x=startx;x!=stopx;x+=jx){
		for(y=starty;y!=stopy;y+=jy){
			zapis+='<polygon points="'+shadow(x,y,metrix[x][y])+' '+shadow(x,y+1,metrix[x][y+1])+' '+shadow(x+1,y+1,metrix[x+1][y+1])+' '+shadow(x+1,y,metrix[x+1][y])+'" style="fill:hsl('+(300*((metrix[x][y]-min)/(max-min)))+', 100%, 50%);stroke:grey;stroke-width:1;" onmouseover="show('+x+','+y+')"></polygon>'
		}
	}
	svg.children[0].innerHTML=zapis
}
function shadow(x,y,z) {//calculate position of node
	xdif=(x-res/2)-camx
	ydif=(y-res/2)-camy
	zdif=((z-min)/(max-min)*res)-camz
	xdeggre=((Math.atan(ydif/xdif)*-1*xdif/Math.abs(xdif))*xdif/Math.abs(xdif))/Math.PI*180-zangle
	xydif=Math.sqrt(xdif**2+ydif**2)
	ydeggre=((Math.atan(xydif/zdif)*-1*zdif/Math.abs(zdif))*zdif/Math.abs(zdif))/Math.PI*180-xangle
	return [xdeggre/fov*width/2+width/2,ydeggre/fov*width/2+width/2]
}
function camera(){//change position of camera
	camx=Math.sin(dtr(zangle))*camdist*Math.cos(dtr(xangle))
	camy=Math.cos(dtr(zangle))*camdist*Math.cos(dtr(xangle))
	camz=Math.sin(dtr(xangle))*camdist
	check=Math.sqrt(camx*camx+camy*camy+camz*camz)
}
setInterval(function(){requestAnimationFrame(draw)},1000)
function show(x,y) {//show value of node mouse is hovering on
	document.querySelector(".show").innerHTML="Vstup: x="+(range[0]+xjump*x)+" y="+(range[2]+yjump*y)+"<br>Výstup: "+metrix[x][y]
}
function prepare(){
	svg=document.querySelector("#Grapher")
	zmove=""
	xmove=""
	window.addEventListener('keydown', function(event) {
		if (zmove == "") {
			if (event.keyCode == 37) {
				zmove = setInterval(function() {
					zangle--
					if(zangle<-180){zangle+=360}
					camera()
				}, tick)
			} else {
				if (event.keyCode == 39) {
					zmove = setInterval(function() {
						zangle++
						if(zangle>180){zangle+=-360}
						camera()
					}, tick)
				}
			}
		}
		if (xmove == "") {
			if (event.keyCode == 38) {
				xmove = setInterval(function() {
					xangle++
					if(xangle>=90){xangle=89.99}
					camera()
				}, tick)
			} else {
				if (event.keyCode == 40) {
					xmove = setInterval(function() {
						xangle--
						if(xangle<=-90){xangle=-89.99}
						camera()
					}, tick)
				}
			}
		}
	})
	window.addEventListener('keyup', function(event) {
		if (event.keyCode == 37 || event.keyCode == 39) {
			clearInterval(zmove)
			zmove = ""
		}
		if (event.keyCode == 38 || event.keyCode == 40) {
			clearInterval(xmove)
			xmove = ""
		}
	})
}
camera()