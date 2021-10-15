<script>
	const alienWidth = 125;
	const alienHeight = 190;
	let bodyAccentColor = '#1B7A2B';
	let bodyColor = '#2CC947';
	let selectedTab = 'color';
	let hatScaleX = 125;
	let hatScaleY = 28;
	let hatY = 0;
	let hatX = 1;
	let hatRotation = 0;
	let svgElement;

	const hats = [
		'11.png',
		'16.png',
		'17.png',
		'18.png',
		'19.png',
		'20.png',
		'21.png',
		'22.png',
		'23.png',
		'24.png',
		'25.png',
		'26.png',
		'3.png',
		'33.png',
		'34.png',
		'36.png',
		'4.png',
		'5.png',
		'6.png',
		'7.png',
		'8.png',
		'9.png',
	];

	let selectedHat = '24.png';

	$: hatTransform = `
		translate(${hatX}, ${hatY})
	`;

	function getBase64Hat(hatName) {
		const image = document.createElement('img');
		image.src = `./assets/hats/${hatName}`;
		image.addEventListener('load', () => {
			const canvas = document.createElement('canvas');
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(image, 0, 0);
			const base64Image = canvas.toDataURL();
			selectedHat = base64Image;
		});
	}

	function saveAsPNG() {
		const image = document.createElement('img');
		image.src = `data:image/svg+xml;base64,${btoa(svgElement.outerHTML)}`;
		image.addEventListener('load', () => {
			const canvas = document.createElement('canvas');
			canvas.width = 125;
			canvas.height = 190;
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(image, 0, 0);
			const base64Image = canvas.toDataURL();
			const aDownloadLink = document.createElement('a');
			aDownloadLink.download = 'my-alien.png';
			aDownloadLink.href = base64Image;
			aDownloadLink.click();
		});
	}
</script>

<main>
	<h1>Aliens as A Service</h1>
	<svg bind:this={svgElement} style="position: relative" width="125" height="190" viewBox="0 0 125 190" fill="none" xmlns="http://www.w3.org/2000/svg">
		<style>
			image {
				image-rendering: crisp-edges;
			}
		</style>
		<path d="M52 125V118H39V125H52Z" fill="{bodyAccentColor}"/>
		<path d="M39 118V111H32V118H39Z" fill="{bodyAccentColor}"/>
		<path d="M59 6V13H66V19H72V32H79V39H86V46H105V72H112V45H105V32H99V26H92V19H85V13H72V6H59Z" fill="{bodyAccentColor}"/>
		<path d="M105 72H98V78H92V85H79V98H72V105H66V112H59V118H72V112H85V111V105H92V99H99V85H105V72Z" fill="{bodyAccentColor}"/>
		<path d="M85 112V118H72V125H52V131H79V124H99V131H112V138H118V124H105V118H92V111H85V112Z" fill="{bodyAccentColor}"/>
		<path d="M13 131V138H26V131H13Z" fill="{bodyAccentColor}"/>
		<path d="M39 138H46V151H39V138Z" fill="{bodyAccentColor}"/>
		<path d="M46 177V171H33V177H46Z" fill="{bodyAccentColor}"/>
		<path d="M33 184V177H20V184H33Z" fill="{bodyAccentColor}"/>
		<path d="M52 171V164H46V171H52Z" fill="{bodyAccentColor}"/>
		<path d="M52 164H72V157H52V164Z" fill="{bodyAccentColor}"/>
		<path d="M79 170V164H72V170H79Z" fill="{bodyAccentColor}"/>
		<path d="M85 177V170H79V177H85Z" fill="{bodyAccentColor}"/>
		<path d="M98 170V177H105V170H98Z" fill="{bodyAccentColor}"/>
		<path d="M98 164H92V170H98V164Z" fill="{bodyAccentColor}"/>
		<path d="M85 144H79V157H85V164H92V150H85V144Z" fill="{bodyAccentColor}"/>
		<path d="M59 6H52V13H39V19H32V26H26V33H19V46H46.5V52.5H52.5V58.5H59.5V85.5H32.5V78.5H25.5V72H19V85H26V99H32V105H39V111V112H52V118H59V112H66V105H72V98H79V85.5H65.5V58.5H71.5V52.5H78.5V45.5H86V39H79V32H72V19H66V13H59V6Z" fill="{bodyColor}"/>
		<path d="M19 46H13V72H19V46Z" fill="{bodyColor}"/>
		<path d="M39 118V125H52V131H79V124H99V131H112V138H98V131H92V138H85V144H79V157H85V164H92V170H98V177H105V184H92V177H85V170H79V164H72V157H52V164H46V171H33V177H20V170H26V164H32V151H46V138H39H32V131H26H13V138H6V124H19V118H39Z" fill="{bodyColor}"/>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M85 6H72V0H52V6H39V13H32V19H26V26H19V33H13V46H6V72H13V85H19V99H26V105H32V111H19V118H6V124H0V138H6V144H26V138H32V151H26V164H19V170H13V184H20V190H33V184H46V177H52V171H72V164H52V171H46V177H33V184H20V170H26V164H32V151H39V138H32V131H26V138H6V124H19V118H32V111H39V105H32V99H26V85H19V72H13V46H19V33H26V26H32V19H39V13H52V6H72V13H85V19H92V26H99V32H105V45H112V72H105V85H99V99H92V105H85V111H92V118H105V124H118V118H105V111H92V105H99V99H105V85H112V72H118V45H112V32H105V26H99V19H92V13H85V6ZM78 177V184H92V190H105V184H112V170H105V184H92V177H79H78ZM98 164V150H92V138H98V144H118V138H98V131H92V138H85V150H92V164H98Z" fill="black"/>
		<path d="M72 125V118H52V125H72Z" fill="black"/>
		<path d="M39 111V118H52V111H39Z" fill="black"/>
		<path d="M85 111H72V118H85V111Z" fill="black"/>
		<path d="M72 177H78H79V170H72V171V177Z" fill="black"/>
		<path d="M125 124H118V138H125V124Z" fill="black"/>
		<path d="M105 164H98V170H99H105V164Z" fill="black"/>
		<path d="M24 68.5L24.5 50.5L41.5 49.5L48 59.5V73.5H36V68.5H24Z" fill="white"/>
		<path d="M70 75V63.5L82.5 49.5H101L101.5 66L83.5 73.5L70 75Z" fill="white"/>
		<path d="M24 68.5L24.5 50.5L41.5 49.5L48 59.5V73.5H36V68.5H24Z" stroke="black"/>
		<path d="M70 75V63.5L82.5 49.5H101L101.5 66L83.5 73.5L70 75Z" stroke="black"/>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M19 72V46H46.5V52.5H52.5V58.5H59.5V85.5H32.5V78.5H25.5V72H19ZM39 72V65H46V72H39ZM33 66H26V52H40V59H33V66Z" fill="black"/>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M65.5 85.5V58.5H71.5V52.5H78.5V45.5L105 45.5V72H98V78H92V85.5H65.5ZM72 65V72H79V65H72ZM99 66H91V59H85V52H99V66Z" fill="black"/>
		<g transform="translate({hatX}, {hatY})">
			<image preserveAspectRatio="none" image-rendering="optimizeSpeed" width="{hatScaleX}" height="{hatScaleY}" href="{selectedHat}" alt="alt" class="hat" />
		</g>
	</svg>
	<div class="mt-4">
		<button on:click={saveAsPNG} class="btn btn-success">DOWNLOAD</button>
	</div>
	<ul class="nav nav-pills">
		<li on:click={() => selectedTab = 'color'} class="nav-item">
			<p class:active="{selectedTab === 'color'}" class="nav-link">Color</p>
		</li>
		<li on:click={() => selectedTab = 'headwear'} class="nav-item">
			<p class:active="{selectedTab === 'headwear'}" class="nav-link">Headwear</p>
		</li>
	</ul>
	<div class="tab-content">
		<div class="tab-pane fade active show">
			{#if selectedTab === 'color'}
				<label>Body Color</label>
				<input type="color" bind:value={bodyColor} />
				<br />
				<label>Body Accent Color</label>
				<input type="color" bind:value={bodyAccentColor} />
			{/if}

			{#if selectedTab === 'headwear'}
				<div>
					{#each hats as name}
						<img class:selected="{selectedHat === name}" on:click={() => getBase64Hat(name)} class="hat-preview" src="./assets/hats/{name}" alt="name" />
					{/each}
				</div>
				<label>Hat Width</label>
				<input type="range" step="0.01" min="0" max="{alienWidth}" bind:value={hatScaleX} />
				<br />
				<label>Hat Height</label>
				<input type="range" step="0.01" min="0" max="{alienHeight}" bind:value={hatScaleY} />
				<br />
				<label>Hat X</label>
				<input type="range" step="1" min="-100" max="{alienWidth}" bind:value={hatX} />
				<br />
				<label>Hat Y</label>
				<input type="range" step="1" min="-100" max="{alienHeight}" bind:value={hatY} />
				<br />
				<label>Hat Rotation</label>
				<input type="range" step="1" min="0" max="360" bind:value={hatRotation} />
			{/if}
		</div>
	</div>
</main>

<style>
main {
	width: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
}

.alien-body {
	width: 100%;
	height: auto;
}

.hat {
	position: absolute;
	transform-origin: bottom;
}

img {
	image-rendering: crisp-edges;
}

.hat-preview {
	width: 100px;
	height: auto;
}

.selected {
	outline: 2px solid white;
}
</style>