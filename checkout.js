document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.toggle-click').forEach((toggleClick) => {
		toggleClick.addEventListener('click', () => {
			toggleClick.parentNode.querySelector('.toggle-show').style.display = 'flex';
			document.addEventListener('click', (ev) => {
				if (toggleClick) {
					if (!ev.path.includes(toggleClick)
						&&
						!ev.path.includes(toggleClick.parentNode.querySelector('.toggle-show'))
						||
						ev.path.includes(toggleClick.parentNode.querySelector('.to-cart'))
					) {
						toggleClick.parentNode.querySelector('.toggle-show').style.display = 'none';
					}
				}
			});
		});
	});

	let slideIndex = 2;
	showSlides(slideIndex);

	document.querySelectorAll('.dot').forEach((dot, index) => {
		dot.addEventListener('click', () => {
			showSlides(slideIndex = (index + 1));
		});
	});

	document.querySelectorAll('.nav').forEach(nav => {
		nav.addEventListener('click', () => {
			nav.classList.contains('next')
				? showSlides(slideIndex += 1)
				: showSlides(slideIndex -= 1);
		});
	});

	function showSlides(n) {
		const slides = document.querySelectorAll(".slide-container");
		const dots = document.querySelectorAll(".dot");

		n < 1 ? slideIndex = slides.length : n > slides.length ? slideIndex = 1 : {};

		slides.forEach(slide => { slide.style.display = 'none'; });
		dots.forEach(dot => { dot.className = dot.className.replace(' active', ''); });

		slides[slideIndex - 1].style.display = 'block';
		dots[slideIndex - 1].className += ' active';
	}

	setInterval(() => { showSlides(slideIndex += 1) }, 10000);

	document.querySelectorAll('.cart-q').forEach(iq => {
		iq.addEventListener('change', () => {
			!(iq.value > 0)
				? iq.parentNode.querySelector('.to-cart').setAttribute('disabled', 'disabled')
				: iq.parentNode.querySelector('.to-cart').removeAttribute('disabled');
			if (document.querySelector('.services-selector').value == '') {
				iq.parentNode.querySelector('.to-cart').setAttribute('disabled', 'disabled');
			}
		});
	});

	let cart = [];
	let cartId = -1;
	document.querySelectorAll('.to-cart').forEach(toCart => {
		toCart.addEventListener('click', () => {
			if (toCart.getAttribute('disabled') != 'disabled') {
				cart.push({
					quantity: toCart.parentNode.querySelector('.cart-q').value,
					title: toCart.parentNode.parentNode.parentNode.querySelector('.cart-t').textContent || toCart.parentNode.parentNode.parentNode.querySelector('.cart-t').value,
					price: toCart.parentNode.parentNode.querySelector('.cart-p').textContent || toCart.parentNode.parentNode.querySelector('.cart-p').value,
					id: cartId +=1
				});
				document.querySelectorAll('.cart-visible tr:not(.cart-header)').forEach(tr => {
					tr.remove();
				});
				let cartTotal = 0;
				cart.forEach(item => {
					const itemRow = document.createElement('tr');
					const itemDelete = document.createElement('td');

					itemDelete.textContent = '✖';
					itemDelete.setAttribute('class','cart-delete');

					itemRow.setAttribute('id',`cart-id-${item.id}`);
					itemRow.appendChild(itemDelete);
					Object.keys(item).forEach(key => {
						if(key != 'id'){
							let itemData = document.createElement('td');
							itemData.setAttribute('class', `cart-${key}`);
							itemData.textContent = item[key];
							itemRow.appendChild(itemData);
						}
					});
					document.querySelector('.cart-visible').appendChild(itemRow);
					cartTotal += Number(item.price);
				});
				document.querySelector('.cart-total').textContent = Number(cartTotal).toFixed(2);
				if (document.querySelector('.cart-button').classList.contains('pulse')) {
					document.querySelector('.cart-button').style.animation = 'none';
					setTimeout(()=>{
						document.querySelector('.cart-button').style.animation = '';
					}, 10);
				} else {
					document.querySelector('.cart-button').classList.add('pulse');
				}

				document.querySelectorAll('.cart-delete').forEach(cartDelete => {
					cartDelete.addEventListener('click', () => {
						const item = cart.find((toDelete)=>toDelete.id == cartDelete.parentNode.id.split('-').slice(-1)[0]);
						const index = cart.indexOf(item);
						if(index > -1){
							cart.splice(index, 1);
						}
						cartDelete.parentNode.remove();
						let cartTotal = 0;
						cart.forEach(item => {
							cartTotal += Number(item.price);
						});
						document.querySelector('.cart-total').textContent = Number(cartTotal).toFixed(2);
					});
				});
			}
		});
	});

	document.querySelector('.services-selector').addEventListener('change', (change) => {
		change.target.parentNode.parentNode.querySelector('.cart-t').value = change.target.value;
		if (change.target.value != '' && document.querySelector('.services-quantity').value > 0) {
			change.target.parentNode.querySelector('.to-cart').removeAttribute('disabled');
		}
	});

	document.querySelector('.paypal').addEventListener('submit',(e)=>{
		console.log(e);
		e.preventDefault();
		cart.forEach((item, index)=>{
			Object.keys(item).forEach(key=>{
				if(key != 'id'){
					const paypalInput = document.createElement('input');
					paypalInput.setAttribute('type', 'hidden');
					paypalInput.setAttribute('value', item[key]);
					switch(key){
						case 'title':
							paypalInput.setAttribute('name', `item_name_${index+1}`);
							break;
						case 'quantity':
							paypalInput.setAttribute('name', `quantity_${index + 1}`);
							break;
						case 'price':
							paypalInput.setAttribute('name', `amount_${index+1}`);
							break;
					}
					e.target.appendChild(paypalInput);
				}
			});
		});
		e.target.submit();
	}, {once: true});

});