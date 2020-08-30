var svg
var max
var min
var metrix=[]
var xjump
var yjump
var fov = 70
var downx
var downy
var res
function makemetrix(expression,ranges,resolution){//Expression,[xmin,xmax,ymin,ymax],resolution
	min=undefined
	max=undefined
	downx=ranges[0]
	downy=ranges[2]
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
	console.log(metrix)
}
function prepare(svgdom){
	svg=svgdom
}