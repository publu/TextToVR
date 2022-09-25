import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126/build/three.module.js';
    import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126/examples/jsm/controls/OrbitControls.js';
    import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.126/examples/jsm/webxr/VRButton.js';
    import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126/examples/jsm/loaders/OBJLoader.js';
    import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126/examples/jsm/loaders/MTLLoader.js';

    let scene, renderer, camera, randomNumber;

    randomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);

    let manager = new THREE.LoadingManager();
    manager.onLoad = function () {
      onLoadComplete();
      animate();
    };

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2, 250);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xd8e7ff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 3.5;
    camera.position.z = -12;

    const plane = new THREE.GridHelper(50, 50);
    plane.material.color = new THREE.Color("#696969");
    scene.add(plane);

    const AxesHelper = new THREE.AxesHelper(10);
    scene.add(AxesHelper);

    let light1 = new THREE.DirectionalLight(0xefefff, 1.5);
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0xffefef, 1.5);
    light2.position.set(-1, -1, -1).normalize();
    scene.add(light2);

    let materialArray = [];
    let textureFt = new THREE.TextureLoader().load('https://dl.dropbox.com/s/hoegrz3op6afwqm/meadow_ft.jpg');
    let textureBk = new THREE.TextureLoader().load('https://dl.dropbox.com/s/ngegamvmo4m0keb/meadow_bk.jpg');
    let textureUp = new THREE.TextureLoader().load('https://dl.dropbox.com/s/a0oo4gnri6n0gm4/meadow_up.jpg');
    let textureDn = new THREE.TextureLoader().load('https://dl.dropbox.com/s/65swak4kn325rz9/meadow_dn.jpg');
    let textureRt = new THREE.TextureLoader().load('https://dl.dropbox.com/s/pdg7xhm8onc8j0w/meadow_rt.jpg');
    let textureLf = new THREE.TextureLoader().load('https://dl.dropbox.com/s/xto44qkmlof7f3y/meadow_lf.jpg');

    materialArray.push(new THREE.MeshBasicMaterial({ map: textureFt }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textureBk }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textureUp }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textureDn }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textureRt }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textureLf }));

    for (let i = 0; i < 6; i++) {
      materialArray[i].side = THREE.BackSide;
    }

    const skyBoxGeo = new THREE.BoxGeometry(100, 100, 100);
    const skyBox = new THREE.Mesh(skyBoxGeo, materialArray);
    scene.add(skyBox);

    const materialsLoader = new MTLLoader(manager);
    materialsLoader.load('https://dl.dropbox.com/s/u6ezynpiohoa8px/Tree1.mtl', function (materials) {
      const objLoader = new OBJLoader(manager);
      objLoader.setMaterials(materials);
      objLoader.load('https://dl.dropbox.com/s/c0wyk5bu4k9wdtk/Tree1.obj', function (object) {
        object.scale.set(0, 0, 0);

        for (let i = 0; i < 50; i++) {
          const clone = object.clone();
          clone.position.x = randomNumber(-20, 20);
          clone.position.y = 0;
          clone.position.z = randomNumber(-20, 20);
          scene.add(clone);
        }
      },
      (xhr) => console.log('loading...'), //console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
      (error) => console.log('An error happened', error));
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxPolarAngle = Math.PI / 2.1; //How far you can orbit vertically. You wont see below the below the line of the horizon.

    function animate() {
      renderer.setAnimationLoop(() => renderer.render(scene, camera));
      controls.update();
    }

    function onWindowResize () {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function onLoadComplete() {
      const loadingScreen = document.querySelector('#loading');
      loadingScreen.remove();
    }

    window.addEventListener('resize', onWindowResize);
    document.body.appendChild(VRButton.createButton(renderer));