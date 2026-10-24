from pathlib import Path
import struct, zlib, sys

S=1024
pix=bytearray([247,241,231,255]*S*S)
def setpx(x,y,c):
    if 0<=x<S and 0<=y<S:
        i=(y*S+x)*4; pix[i:i+4]=bytes((*c,255))
def rect(x0,y0,x1,y1,c):
    for y in range(max(0,y0),min(S,y1)):
        a=(y*S+max(0,x0))*4; b=(y*S+min(S,x1))*4; pix[a:b]=bytes((*c,255))*(min(S,x1)-max(0,x0))
def rounded(x0,y0,x1,y1,r,c):
    for y in range(y0,y1):
        for x in range(x0,x1):
            cx=min(max(x,x0+r),x1-r-1); cy=min(max(y,y0+r),y1-r-1)
            if (x-cx)**2+(y-cy)**2<=r*r:setpx(x,y,c)
def outline(x0,y0,x1,y1,w,c):
    rect(x0,y0,x1,y0+w,c);rect(x0,y1-w,x1,y1,c);rect(x0,y0,x0+w,y1,c);rect(x1-w,y0,x1,y1,c)
def line(x0,y0,x1,y1,w,c):
    n=max(abs(x1-x0),abs(y1-y0),1)
    for i in range(n+1):
        x=round(x0+(x1-x0)*i/n);y=round(y0+(y1-y0)*i/n)
        for yy in range(y-w//2,y+w//2+1):
            for xx in range(x-w//2,x+w//2+1):setpx(xx,yy,c)
def poly(points,fill,stroke,w):
    for y in range(min(y for x,y in points),max(y for x,y in points)+1):
        xs=[]
        for (x1,y1),(x2,y2) in zip(points,points[1:]+points[:1]):
            if (y1<=y<y2)or(y2<=y<y1):xs.append(round(x1+(y-y1)*(x2-x1)/(y2-y1)))
        for a,b in zip(sorted(xs)[::2],sorted(xs)[1::2]):rect(a,y,b+1,y+1,fill)
    for a,b in zip(points,points[1:]+points[:1]):line(*a,*b,w,stroke)
ink=(23,23,23);yellow=(255,216,77);pink=(255,109,157);lilac=(199,173,243);white=(255,253,248)
rounded(174,174,898,898,104,ink);rounded(150,145,874,869,104,yellow);outline(150,145,874,869,24,ink)
rect(270,330,754,694,white);outline(270,330,754,694,24,ink);rect(270,330,754,430,pink);outline(270,330,754,430,24,ink)
line(350,278,350,390,30,ink);line(674,278,674,390,30,ink)
for cy,cx in [(378,324),(378,700)]:
    for y in range(cy-18,cy+19):
        for x in range(cx-18,cx+19):
            if (x-cx)**2+(y-cy)**2<=18**2:setpx(x,y,ink)
poly([(512,478),(541,536),(602,544),(556,587),(568,656),(512,624),(456,656),(468,587),(422,544),(483,536)],lilac,ink,20)
def chunk(t):return struct.pack('>I',len(t)-4)+t+struct.pack('>I',zlib.crc32(t)&0xffffffff)
raw=b''.join(b'\0'+bytes(pix[y*S*4:(y+1)*S*4]) for y in range(S))
out=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR'+struct.pack('>IIBBBBB',S,S,8,6,0,0,0))+chunk(b'IDAT'+zlib.compress(raw,9))+chunk(b'IEND')
Path(sys.argv[1]).write_bytes(out)
