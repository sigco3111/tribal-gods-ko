import"./three-7ec1a3aa.js";import{i as K,az as ee,T as te,V as C,m as ie,O as se,j,ay as A,bO as I,o as M,d as G,H as N,aC as re,cg as ae,k as oe,f as ne,n as le,b_ as ue,bZ as he,bY as fe,bX as ce,bW as me,bV as pe,bU as de,C as H,bK as ge,X as ve}from"./three-core-f9b7c6e3.js";function Ee(h,e=!1){const i=h[0].index!==null,s=new Set(Object.keys(h[0].attributes)),o=new Set(Object.keys(h[0].morphAttributes)),t={},a={},c=h[0].morphTargetsRelative,l=new K;let n=0;for(let r=0;r<h.length;++r){const f=h[r];let d=0;if(i!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in f.attributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;t[u]===void 0&&(t[u]=[]),t[u].push(f.attributes[u]),d++}if(d!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". Make sure all geometries have the same number of attributes."),null;if(c!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in f.morphAttributes){if(!o.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(f.morphAttributes[u])}if(e){let u;if(i)u=f.index.count;else if(f.attributes.position!==void 0)u=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". The geometry must have either an index or a position attribute"),null;l.addGroup(n,u,r),n+=u}}if(i){let r=0;const f=[];for(let d=0;d<h.length;++d){const u=h[d].index;for(let b=0;b<u.count;++b)f.push(u.getX(b)+r);r+=h[d].attributes.position.count}l.setIndex(f)}for(const r in t){const f=X(t[r]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+r+" attribute."),null;l.setAttribute(r,f)}for(const r in a){const f=a[r][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[r]=[];for(let d=0;d<f;++d){const u=[];for(let p=0;p<a[r].length;++p)u.push(a[r][p][d]);const b=X(u);if(!b)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+r+" morphAttribute."),null;l.morphAttributes[r].push(b)}}return l}function X(h){let e,i,s,o=-1,t=0;for(let n=0;n<h.length;++n){const r=h[n];if(e===void 0&&(e=r.array.constructor),e!==r.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(i===void 0&&(i=r.itemSize),i!==r.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(s===void 0&&(s=r.normalized),s!==r.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(o===-1&&(o=r.gpuType),o!==r.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;t+=r.count*i}const a=new e(t),c=new ee(a,i,s);let l=0;for(let n=0;n<h.length;++n){const r=h[n];if(r.isInterleavedBufferAttribute){const f=l/i;for(let d=0,u=r.count;d<u;d++)for(let b=0;b<i;b++){const p=r.getComponent(d,b);c.setComponent(d+f,b,p)}}else a.set(r.array,l);l+=r.count*i}return o!==void 0&&(c.gpuType=o),c}function we(h,e=1e-4){e=Math.max(e,Number.EPSILON);const i={},s=h.getIndex(),o=h.getAttribute("position"),t=s?s.count:o.count;let a=0;const c=Object.keys(h.attributes),l={},n={},r=[],f=["getX","getY","getZ","getW"],d=["setX","setY","setZ","setW"];for(let m=0,T=c.length;m<T;m++){const v=c[m],g=h.attributes[v];l[v]=new g.constructor(new g.array.constructor(g.count*g.itemSize),g.itemSize,g.normalized);const w=h.morphAttributes[v];w&&(n[v]||(n[v]=[]),w.forEach((S,D)=>{const E=new S.array.constructor(S.count*S.itemSize);n[v][D]=new S.constructor(E,S.itemSize,S.normalized)}))}const u=e*.5,b=Math.log10(1/e),p=Math.pow(10,b),z=u*p;for(let m=0;m<t;m++){const T=s?s.getX(m):m;let v="";for(let g=0,w=c.length;g<w;g++){const S=c[g],D=h.getAttribute(S),E=D.itemSize;for(let P=0;P<E;P++)v+=`${~~(D[f[P]](T)*p+z)},`}if(v in i)r.push(i[v]);else{for(let g=0,w=c.length;g<w;g++){const S=c[g],D=h.getAttribute(S),E=h.morphAttributes[S],P=D.itemSize,J=l[S],$=n[S];for(let L=0;L<P;L++){const V=f[L],Q=d[L];if(J[Q](a,D[V](T)),E)for(let U=0,q=E.length;U<q;U++)$[U][Q](a,E[U][V](T))}}i[v]=a,r.push(a),a++}}const x=h.clone();for(const m in h.attributes){const T=l[m];if(x.setAttribute(m,new T.constructor(T.array.slice(0,a*T.itemSize),T.itemSize,T.normalized)),m in n)for(let v=0;v<n[m].length;v++){const g=n[m][v];x.morphAttributes[m][v]=new g.constructor(g.array.slice(0,a*g.itemSize),g.itemSize,g.normalized)}}return x.setIndex(r),x}const R=new C;function _(h,e,i,s,o,t){const a=2*Math.PI*o/4,c=Math.max(t-2*o,0),l=Math.PI/4;R.copy(e),R[s]=0,R.normalize();const n=.5*a/(a+c),r=1-R.angleTo(h)/l;return Math.sign(R[i])===1?r*n:c/(a+c)+n+n*(1-r)}class Y extends te{constructor(e=1,i=1,s=1,o=2,t=.1){const a=o*2+1;if(t=Math.min(e/2,i/2,s/2,t),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:i,depth:s,segments:o,radius:t},a===1)return;const c=this.toNonIndexed();this.index=null,this.attributes.position=c.attributes.position,this.attributes.normal=c.attributes.normal,this.attributes.uv=c.attributes.uv;const l=new C,n=new C,r=new C(e,i,s).divideScalar(2).subScalar(t),f=this.attributes.position.array,d=this.attributes.normal.array,u=this.attributes.uv.array,b=f.length/6,p=new C,z=.5/a;for(let x=0,m=0;x<f.length;x+=3,m+=2)switch(l.fromArray(f,x),n.copy(l),n.x-=Math.sign(n.x)*z,n.y-=Math.sign(n.y)*z,n.z-=Math.sign(n.z)*z,n.normalize(),f[x+0]=r.x*Math.sign(l.x)+n.x*t,f[x+1]=r.y*Math.sign(l.y)+n.y*t,f[x+2]=r.z*Math.sign(l.z)+n.z*t,d[x+0]=n.x,d[x+1]=n.y,d[x+2]=n.z,Math.floor(x/b)){case 0:p.set(1,0,0),u[m+0]=_(p,n,"z","y",t,s),u[m+1]=1-_(p,n,"y","z",t,i);break;case 1:p.set(-1,0,0),u[m+0]=1-_(p,n,"z","y",t,s),u[m+1]=1-_(p,n,"y","z",t,i);break;case 2:p.set(0,1,0),u[m+0]=1-_(p,n,"x","z",t,e),u[m+1]=_(p,n,"z","x",t,s);break;case 3:p.set(0,-1,0),u[m+0]=1-_(p,n,"x","z",t,e),u[m+1]=1-_(p,n,"z","x",t,s);break;case 4:p.set(0,0,1),u[m+0]=1-_(p,n,"x","y",t,e),u[m+1]=1-_(p,n,"y","x",t,i);break;case 5:p.set(0,0,-1),u[m+0]=_(p,n,"x","y",t,e),u[m+1]=1-_(p,n,"y","x",t,i);break}}static fromJSON(e){return new Y(e.width,e.height,e.depth,e.segments,e.radius)}}const O={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class y{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const be=new se(-1,1,1,-1,0,1);class xe extends K{constructor(){super(),this.setAttribute("position",new j([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new j([0,2,0,0,2,0],2))}}const Se=new xe;class k{constructor(e){this._mesh=new ie(Se,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,be)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Z extends y{constructor(e,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,e instanceof A?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=I.clone(e.uniforms),this.material=new A({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new k(this.material)}render(e,i,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class W extends y{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,s){const o=e.getContext(),t=e.state;t.buffers.color.setMask(!1),t.buffers.depth.setMask(!1),t.buffers.color.setLocked(!0),t.buffers.depth.setLocked(!0);let a,c;this.inverse?(a=0,c=1):(a=1,c=0),t.buffers.stencil.setTest(!0),t.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),t.buffers.stencil.setFunc(o.ALWAYS,a,4294967295),t.buffers.stencil.setClear(c),t.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),t.buffers.color.setLocked(!1),t.buffers.depth.setLocked(!1),t.buffers.color.setMask(!0),t.buffers.depth.setMask(!0),t.buffers.stencil.setLocked(!1),t.buffers.stencil.setFunc(o.EQUAL,1,4294967295),t.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),t.buffers.stencil.setLocked(!0)}}class Te extends y{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Ae{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const s=e.getSize(new M);this._width=s.width,this._height=s.height,i=new G(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:N}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Z(O),this.copyPass.material.blending=re,this.clock=new ae}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const i=this.renderer.getRenderTarget();let s=!1;for(let o=0,t=this.passes.length;o<t;o++){const a=this.passes[o];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(o),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),a.needsSwap){if(s){const c=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(c.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(c.EQUAL,1,4294967295)}this.swapBuffers()}W!==void 0&&(a instanceof W?s=!0:a instanceof Te&&(s=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new M);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const s=this._width*this._pixelRatio,o=this._height*this._pixelRatio;this.renderTarget1.setSize(s,o),this.renderTarget2.setSize(s,o);for(let t=0;t<this.passes.length;t++)this.passes[t].setSize(s,o)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const _e={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new M(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`};class ye extends Z{constructor(){super(_e)}setSize(e,i){this.material.uniforms.resolution.value.set(1/e,1/i)}}const F={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class ze extends y{constructor(){super(),this.isOutputPass=!0,this.uniforms=I.clone(F.uniforms),this.material=new oe({name:F.name,uniforms:this.uniforms,vertexShader:F.vertexShader,fragmentShader:F.fragmentShader}),this._fsQuad=new k(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ne.getTransfer(this._outputColorSpace)===le&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ue?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===he?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===fe?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ce?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===me?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===pe?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===de&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Pe extends y{constructor(e,i,s=null,o=null,t=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=s,this.clearColor=o,this.clearAlpha=t,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new H}render(e,i,s){const o=e.autoClear;e.autoClear=!1;let t,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(t=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(t),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=o}}const Me={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new H(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class B extends y{constructor(e,i=1,s,o){super(),this.strength=i,this.radius=s,this.threshold=o,this.resolution=e!==void 0?new M(e.x,e.y):new M(256,256),this.clearColor=new H(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let t=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new G(t,a,{type:N}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let r=0;r<this.nMips;r++){const f=new G(t,a,{type:N});f.texture.name="UnrealBloomPass.h"+r,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const d=new G(t,a,{type:N});d.texture.name="UnrealBloomPass.v"+r,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),t=Math.round(t/2),a=Math.round(a/2)}const c=Me;this.highPassUniforms=I.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new A({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];t=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let r=0;r<this.nMips;r++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[r])),this.separableBlurMaterials[r].uniforms.invSize.value=new M(1/t,1/a),t=Math.round(t/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const n=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=n,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=I.clone(O.uniforms),this.blendMaterial=new A({uniforms:this.copyUniforms,vertexShader:O.vertexShader,fragmentShader:O.fragmentShader,premultipliedAlpha:!0,blending:ge,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new H,this._oldClearAlpha=1,this._basic=new ve,this._fsQuad=new k(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,i){let s=Math.round(e/2),o=Math.round(i/2);this.renderTargetBright.setSize(s,o);for(let t=0;t<this.nMips;t++)this.renderTargetsHorizontal[t].setSize(s,o),this.renderTargetsVertical[t].setSize(s,o),this.separableBlurMaterials[t].uniforms.invSize.value=new M(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2)}render(e,i,s,o,t){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),t&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=s.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let c=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=c.texture,this.separableBlurMaterials[l].uniforms.direction.value=B.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=B.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),c=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,t&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const i=[],s=e/3;for(let o=0;o<e;o++)i.push(.39894*Math.exp(-.5*o*o/(s*s))/s);return new A({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new M(.5,.5)},direction:{value:new M(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new A({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}B.BlurDirectionX=new M(1,0);B.BlurDirectionY=new M(0,1);export{Ae as E,ye as F,ze as O,Pe as R,Z as S,B as U,we as a,Y as b,Ee as m};
