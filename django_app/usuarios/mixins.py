from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin


class CoordinadorRequeridoMixin(LoginRequiredMixin, UserPassesTestMixin):
    # solo coordinadores y administradores
    def test_func(self):
        return self.request.user.es_coordinador
